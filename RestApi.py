#!env/bin/python
from flask import Flask, request, Response,  render_template, jsonify
from flask_cors import CORS
import json
import girder_client
import PIL
from PIL import Image, ImageFile
import os,sys,io
from io import BytesIO, StringIO 
import numpy as np
import re
import requests
from os import remove
import os
import glob
import h5py
import cv2
import base64
from skimage import data, img_as_float
from skimage import measure
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import pandas as pd
import math

ImageFile.LOAD_TRUNCATED_IMAGES = True

# To avoid PIL.Image.DecompressionBombError: 
# Image size (xxxxxxxx pixels) exceeds limit of 178956970 pixels
PIL.Image.MAX_IMAGE_PIXELS = None
MAX_FEATURES = 500
GOOD_MATCH_PERCENT = 0.15
app = Flask(__name__)


app.config['CORS_HEADERS'] = 'Content-Type'


CORS(app)


@app.route('/')
def index():
    return render_template('index.html')
@app.route('/appready')
def appready():
	return "true"

def alignImages(im1, im2, alignName, outputFolder, im1colored, enhanceFlag):
  # This follows OpenCV example...https://www.learnopencv.com/image-alignment-feature-based-using-opencv-c-python/
  # Convert images to grayscale
  if (enhanceFlag==0):
   im1Gray = cv2.cvtColor(im1, cv2.COLOR_BGR2GRAY)   # image to align
   im2Gray = cv2.cvtColor(im2, cv2.COLOR_BGR2GRAY)   # Ref image
   
  # Detect ORB features and compute descriptors.
  orb = cv2.ORB_create(MAX_FEATURES)
  if (enhanceFlag==0):
   keypoints1, descriptors1 = orb.detectAndCompute(im1Gray, None)
   keypoints2, descriptors2 = orb.detectAndCompute(im2Gray, None)
  else:
   keypoints1, descriptors1 = orb.detectAndCompute(im1, None)
   keypoints2, descriptors2 = orb.detectAndCompute(im2, None) 
   
  # Match features.
  matcher = cv2.DescriptorMatcher_create(cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING)
  matches = matcher.match(descriptors1, descriptors2, None)
   
  # Sort matches by score
  matches.sort(key=lambda x: x.distance, reverse=False)
 
  # Remove not so good matches
  numGoodMatches = int(len(matches) * GOOD_MATCH_PERCENT)
  matches = matches[:numGoodMatches]
 
  # Draw top matches
  imMatches = cv2.drawMatches(im1, keypoints1, im2, keypoints2, matches, None)
  cv2.imwrite(outputFolder + alignName + "matches.jpg", imMatches)
   
  # Extract location of good matches
  points1 = np.zeros((len(matches), 2), dtype=np.float32)
  points2 = np.zeros((len(matches), 2), dtype=np.float32)
 
  for i, match in enumerate(matches):
    points1[i, :] = keypoints1[match.queryIdx].pt
    points2[i, :] = keypoints2[match.trainIdx].pt
   
  # Find homography
  h, mask = cv2.findHomography(points1, points2, cv2.RANSAC)
 
  # Use homography
  if(enhanceFlag==0):
   height, width, channels = im2.shape
   im1Reg = cv2.warpPerspective(im1, h, (width, height))
  else:
   height, width = im2.shape
   im1Reg = cv2.warpPerspective(im1colored, h, (width, height)) 
   
  return im1Reg, h
 


@app.route('/imageRegistration')
def imageRegistration():
  
  
  xreffilename = request.args.get('refName', 0)
  ximgfilename = request.args.get('imgToRegName', 0)
  xoutFolder = request.args.get('outFolder', 0)
  xvpWidth = request.args.get('vpWidth', 0, type=int)
  xvpHeight = request.args.get('vpHeight', 0, type=int)
  xenhancement = request.args.get('enhance', 0, type=int)
  # print("************************************************************")
  if (os.path.isdir(xoutFolder)==False):
   os.mkdir(xoutFolder) 

  if (os.path.isdir(xoutFolder)==True):
   if ((os.path.isfile(xoutFolder+xreffilename)==True) and (os.path.isfile(xoutFolder+ximgfilename)==True)):  
    # Read reference image
    print("Reading reference image : ", xreffilename)
    imReference = cv2.imread(xoutFolder+ xreffilename, cv2.IMREAD_COLOR);

    # Read image to be aligned
    print("Reading image to align : ", ximgfilename);  
    im = cv2.imread(xoutFolder+ ximgfilename, cv2.IMREAD_COLOR);

     
    print("Aligning images ...")
    # Registered image will be restored in imReg. 
    # The estimated homography will be stored in h.
    if(xenhancement==0): 
     imReg, h = alignImages(im, imReference, ximgfilename.split('.')[0], xoutFolder, im, xenhancement)
    else:
      imReferenceGray = cv2.cvtColor(imReference, cv2.COLOR_BGR2GRAY)
      blurRef = cv2.GaussianBlur(imReferenceGray,(5,5),0)
      retRef,imReference_OTSU = cv2.threshold(blurRef,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
      cv2.imwrite(xoutFolder+"imReference_OTSU.jpg", imReference_OTSU)
      imGray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
      blurIm = cv2.GaussianBlur(imGray,(5,5),0)
      retIm,im_OTSU = cv2.threshold(blurIm,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
      cv2.imwrite(xoutFolder+"im2reg_OTSU.jpg", im_OTSU)
      imReg, h = alignImages(im_OTSU, imReference_OTSU, ximgfilename.split('.')[0], xoutFolder,im, xenhancement)
    # Write aligned image to disk. 
    outFilename = ximgfilename.split('.')[0]+"aligned.jpg"
    print("Saving aligned image : ", outFilename); 
    cv2.imwrite(xoutFolder+outFilename, imReg)
   
    # Print estimated homography
    print("Estimated homography : \n",  h) 

    
  if os.path.isfile(xoutFolder+outFilename):
    DicData=[];
    Dic={'outFilename':'','Hemography':'','outWidth':'','outHeight':'','mse':'', 'psnr':''} ;
    Dic['outFilename']=outFilename
    Dic['Hemography']=h.tolist()
    Dic['outWidth']=imReg.shape[1]
    Dic['outHeight']=imReg.shape[0]
    Dic['mse']=measure.compare_mse(imReference,imReg)
    Dic['psnr']=measure.compare_psnr(imReference,imReg)

    DicData.append(Dic.copy())
    return Response(json.dumps(DicData))
  else:
   return "failed"


def mse(x, y):
    return np.linalg.norm(x - y)



@app.route('/imageQuality')
def imageQuality():
   
  xreffilename = request.args.get('refImage', 0)
  ximgfilename = request.args.get('imgToAss', 0)
  xoutFolder = request.args.get('outFolder', 0)
  
  if (os.path.isdir(xoutFolder)==False):
   os.mkdir(xoutFolder) 

  if (os.path.isdir(xoutFolder)==True):
   if ((os.path.isfile(xoutFolder+xreffilename)==True) and (os.path.isfile(xoutFolder+ximgfilename)==True)):  
    # Read reference image
    print("Reading reference image : ", xreffilename)
    imReference =  cv2.imread(xoutFolder+ xreffilename, cv2.IMREAD_COLOR)   

    # Read image to  assesse
    print("Reading image to Assessment : ", ximgfilename);  
    im =  cv2.imread(xoutFolder+ ximgfilename, cv2.IMREAD_COLOR)
 
    width1, height1, depth1 = imReference.shape
    width2, height2, depth2 = im.shape

    ssim_value = measure.compare_ssim(imReference, im,
    data_range=imReference.max() - imReference.min(),multichannel=True)
    psnr_value = measure.compare_psnr(imReference,im)
    nrmse_value = measure.compare_nrmse(imReference,im)
    mse_value = measure.compare_mse(imReference,im)

    return str(psnr_value)   

@app.route('/saveLayer')
def saveLayer():
  xindex = request.args.get('index', 0)
  xdata_url = request.args.get('imageContent',0)
  xoutFolder = request.args.get('outFolder', 0)
  ximgfilename = request.args.get('imgName', 0)
  xmode = request.args.get('mode', 0)
  if (os.path.isdir(xoutFolder)==False):
   os.mkdir(xoutFolder) 
  xoutFilename = ximgfilename+"layer"+xindex+".txt"

  print(xoutFolder+xoutFilename)
  file=open(xoutFolder+xoutFilename,xmode)  
  file.write(xdata_url)
  file.close()
  if os.path.isfile(xoutFolder+xoutFilename):
   return xoutFilename+" saved"
  else:
   return xoutFilename+" failed" 

@app.route('/saveRegOffsets')
def saveRegOffsets():

  xoutFolder = request.args.get('outFolder', 0)
  xoffsets = request.args.get('offsets', 0)
  xfilename = request.args.get('name', 0)
  xmode = request.args.get('mode', 0)
  if (os.path.isdir(xoutFolder)==False):
   os.mkdir(xoutFolder) 
  xoutFilename = xfilename+"-Offsets"+".txt" 
  if (os.path.isfile(xoutFolder+xoutFilename)==True):  
   os.remove(xoutFolder+xoutFilename)
  file=open(xoutFolder+xoutFilename,xmode)  
  file.write(xoffsets)
  file.close()
  if os.path.isfile(xoutFolder+xoutFilename):
   return "saved"
  else:
   return "failed" 
 

@app.route('/preprocessSavedLayer')

def preprocessSavedLayer():
 
  # try:
  xindex = request.args.get('index', 0)
  xoutFolder = request.args.get('outFolder', 0)
  ximgfilename = request.args.get('imgName', 0)
  if (os.path.isdir(xoutFolder)==False):
   os.mkdir(xoutFolder) 
  outFilename = ximgfilename+"layer"+xindex+".txt"

  if (os.path.isfile(xoutFolder+outFilename)==True):  
   file=open(xoutFolder+outFilename,"r")  
   xdata_url=file.read()
   file.close()
   os.remove(xoutFolder+outFilename) # remove txt file

  content = xdata_url.split(';')[1]
  image_encoded = content.split(',')[1]
  image_encoded_modified=image_encoded.replace(' ', '+')

  # pngImageContent = base64.decodebytes(image_encoded_modified.encode('utf-8'))  // for python version3 only
  # pngImageContent = image_encoded_modified.decode('base64')
  pngImageContent = base64.b64decode(image_encoded_modified.encode('utf-8'))
  outFilename = ximgfilename+"layer"+xindex+".png"
  print("Saving image : ", outFilename); 
  with open(xoutFolder+outFilename, 'wb') as f:
    f.write(pngImageContent)
    f.close()
    
  
 
  img = cv2.imread(xoutFolder+ outFilename, cv2.IMREAD_UNCHANGED)
  # print("-------------------------------------------------------------------------------------------------------------------")
  # print("-------------------------------------------------------------------------------------------------------------------")
  if((img.shape[0]!=0) and (img.shape[1]!=0)):
   y,x = img[:,:,3].nonzero() # get the nonzero alpha coordinates
   minx = np.min(x)
   miny = np.min(y)
   maxx = np.max(x)
   maxy = np.max(y) 
   cropImg = img[miny:maxy, minx:maxx]
   image_without_alpha = cropImg[:,:,:3]
   cv2.imwrite(xoutFolder+outFilename, image_without_alpha)

   return outFilename+" Alpha removed successfully" 
  else: 
   print ('fail') 
   return "fail"

@app.route('/readJsonFile')
def readJsonFile():
  file_name = request.args.get('filename', 0)
  out_folder = request.args.get('outfolder', 0)  
  path_to_file = os.path.join(out_folder, file_name)
  print("Please wait while reading JSON file .....", path_to_file)
  if (os.path.isfile(path_to_file)):  
    file = open(path_to_file, "r")  
    file_contents = file.read()
    file.close()
    return file_contents
  else:
    return jsonify("notExist") 


@app.route('/createBoundariesFromMask')
def createBoundariesFromMask():
  approximation_requested = request.args.get('contourApproxRequest', 0, type=bool)
  print("approximation_requested ", approximation_requested)
  file_name = request.args.get('filename', 0)
  out_folder = request.args.get('outfolder', 0)  
  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  print("Please wait while creating boundaries from mask ................")

  request_url = "/item/" + item_id + "/tiles/region?units=base_pixels&exact=false&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"
   
  gc = girder_client.GirderClient(apiUrl = base_url)

  if( api_key ):
      gc.authenticate(apiKey = api_key)  
      girder_response = gc.get(request_url, jsonResp=False) 
  else:
      girder_response = requests.get(base_url + request_url)  

  cellMaskImage = Image.open(io.BytesIO(girder_response.content))
  cellMaskImage_array = np.array(cellMaskImage)    

  # Check or Convert to grey scale mask
  cellMaskImage_gray = []

  if  len(cellMaskImage_array.shape) > 2 :
      cellMaskImage_gray = cv2.cvtColor(cellMaskImage_array, cv2.COLOR_BGR2GRAY)
      cellMaskImage_array =  cellMaskImage_gray

  # Check or Convert to binary  mask
  if len( np.unique( cellMaskImage_array ) ) > 2 :
      (thresh, cellMaskImage_bw) = cv2.threshold(cellMaskImage_array, 127, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

  else :
      if len( np.unique( cellMaskImage_array ) ) == 2 :
          if cellMaskImage_array.max() == 255 and cellMaskImage_array.min() == 0:
              cellMaskImage_bw = cellMaskImage_array;
          else:                                      
              return "Not a Valid Mask"
      else: 
          return "Not a Valid Mask" 
  
  # Use cv2.RETR_EXTERNAL neglect internal contours (i.e. contour inside contour)
  contours, _ = cv2.findContours(cellMaskImage_bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) 

  mask_height = cellMaskImage_array.shape[0]
  mask_width = cellMaskImage_array.shape[1]

  #check if contours need reverse order
  contours_reverse_flag = True

  polygon = Polygon([(0, 0), (0, mask_width/2), (mask_height/2, mask_width/2), (mask_height/2, 0)])

  for vertex in contours[0]:
      point = Point(vertex[0][0], vertex[0][1])
      if polygon.contains(point) :
          contours_reverse_flag = False

  if contours_reverse_flag :
      contours.reverse()   

  maskBoundariesData = []
  idx = 1
  
  num_of_invalid_contours = 0

  # Conversion loop 
  for contour in contours:
      spxBoundaries = []
      # check whether contours approximation is requested, this can reduced output JSON file around 60%
      if approximation_requested :
          approximated_contour = cv2.approxPolyDP(contour, 0.009 * cv2.arcLength(contour, True), True) 
          cnt = approximated_contour
      else:
          cnt = contour
      # check for valid contours that has at least 3 points    
      if len(cnt) > 2 :
          for vertex in cnt:
              spxBoundaries.append(str(vertex[0][0])+','+str(vertex[0][1])) 
      
      else:
          num_of_invalid_contours += 1
          continue  

      # compute the center of the contour
      M = cv2.moments(cnt)    
      if M["m00"] != 0:
          x_cent = int(M["m10"] / M["m00"])
          y_cent = int(M["m01"] / M["m00"])
      else:
          # set values as what you need in the situation
          # x_cent, y_cent = 0, 0
          num_of_invalid_contours += 1
          continue                       

      maskBoundariesData.append({"label": idx, "x_cent": x_cent, "y_cent": y_cent, "spxBoundaries":' '.join(spxBoundaries)  })
      idx += 1


  # Create Json file 
  if not (os.path.isdir(out_folder)):
          os.makedirs(out_folder)  
  with open(out_folder + file_name, 'w') as f:
      json.dump(maskBoundariesData, f)  
  
  print ' Number of invalid contours : ', num_of_invalid_contours

  if (os.path.isfile(out_folder + file_name)):  
    return "Created successfully"
  else:
    return "Failed"
 # return Response(json.dumps(maskBoundariesData))

def find_bbox(points):
    xpx = []
    ypx = []
    box = []
    for px in points.split(" "):
        xpx.append(int(px.split(",")[0]))
        ypx.append(int(px.split(",")[1]))

    xpx.sort();
    ypx.sort();
   
    xpx_min = xpx[0];
    xpx_max = xpx[len(xpx)-1];
    ypx_min = ypx[0];
    ypx_max = ypx[len(ypx)-1];
    xWidth = xpx_max-xpx_min;
    yHeight = ypx_max-ypx_min;
    
    box.append({"left": xpx_min, "top": ypx_min, "width": xWidth , "height": yHeight})
    
    return box


def is_grey_scale(image):
    if len(image.shape) > 2:
        if (np.array_equal(image[:,:,0], image[:,:,1])) and (np.array_equal(image[:,:,0], image[:,:,2])):  
            return True
        else:
            return False
    else:
        return True


@app.route('/createAllSpxTilesFeature')
def createAllSpxTilesFeature():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  group_data_json_string = request.args.get('grp_data', 0)

  features_file_name = request.args.get('features_file', 0)
  out_features_folder = request.args.get('features_folder', 0)    

  boxplot_file_name = request.args.get('boxplot_file', 0)
  out_boxplot_folder = request.args.get('boxplot_folder', 0)   

  boundaries_file_name = request.args.get('boundaries_file', 0)
  boundaries_folder = request.args.get('boundaries_folder', 0)    

  path_to_boundaries_file = os.path.join(boundaries_folder, boundaries_file_name)
  path_to_features_file = os.path.join(out_features_folder, features_file_name)
  path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)

  if (os.path.isdir(out_boxplot_folder ) == False):
      os.makedirs(out_boxplot_folder)   


  group_data_dic = json.loads(group_data_json_string)

  #tile_prop_list = { 'mean': '', 'max': '', 'std': ''}

  print("Please wait while creating features for boundaries ................")

  if( api_key ):
    gc = girder_client.GirderClient(apiUrl = base_url)
    gc.authenticate(apiKey = api_key)  

  with open(path_to_boundaries_file, 'r+') as f:
      all_spx_boundaries = json.load(f)

  total_tiles = len(all_spx_boundaries)
  print(" image total cells : {}".format(total_tiles))

  allTilesFeatures = []
  tiles_split_channel_features = []
  boxplot_data = []
  tiles_counter = 0

  for marker in group_data_dic:

      print(" Current channel to extract features : {}".format(marker["frameNum"]))

      request_url = "item/" + item_id + "/tiles/region?units=base_pixels&exact=false&frame=" + str(marker["frameNum"]) + "&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"

      if( api_key ):
        girder_response = gc.get(request_url, jsonResp = False) 
      else:
        girder_response = requests.get(base_url + request_url)  

      image_raw = Image.open(io.BytesIO(girder_response.content))
      image = np.array(image_raw)
      
      if not is_grey_scale(image):
        print("channel is not a valide gray scale image, converting  it to gray in progress... ")

        try:            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        except ValueError:  #raised if `y` is empty.
            print(' error converting channel to gray  {}'.format(ValueError))
            return jsonify("Failed");    
            # return jsonify("Not a valide gray channel");     

      # Get boxplot data for each channel
      if not (os.path.isfile(path_to_boxplot_file)): 
        df = pd.DataFrame(image.flatten(), columns=[marker["frameName"]])
        stats = df.describe()
        boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      

      # Get features for each SPX
      tile_points =[] 

      tiles_counter = 0

      error_tiles_counter = 0

      for tile in all_spx_boundaries:

              tile_points = find_bbox(tile["spxBoundaries"])[0]
              imgTile = image[tile_points["top"] : tile_points["top"] + tile_points["height"] , tile_points["left"]: tile_points["left"] + tile_points["width"] ];
              try:            
                  tile_mean = np.mean(imgTile, axis = (0, 1));
                  tile_std = np.std(imgTile, axis = (0, 1));
                  tile_max = np.max(imgTile, axis = (0, 1));

              except ValueError:  #raised if `y` is empty.
                  print(' index  {}'.format(tile["label"]))
                  error_tiles_counter += 1
                  continue


              tiles_split_channel_features.append({"id": "spx-" + str(tile["label"]), "coordinates": tile_points, "features": {'Frame':  marker["frameName"],   'OSDLayer': marker["OSDLayer"],  'max': tile_max.tolist(),  'mean': tile_mean.tolist(),  'std': tile_std.tolist()} })               

              tiles_counter = tiles_counter + 1

  print('Number of valid cells = {}'.format(tiles_counter))

  # Convert dic to dataframe to fast process big data
  df = pd.DataFrame.from_dict(tiles_split_channel_features)

  # Group rows of same tile id and aggregate features key 
  df_grouped_by_id = df.groupby(['id'])["features"].agg(lambda x: list(x) if len(x) > 1 else x.iloc[0]).reset_index()

  allTilesFeatures = df_grouped_by_id.to_dict('records')

  # Create boxplot Json file 
  if not (os.path.isfile(path_to_boxplot_file)): 
      if not (os.path.isdir(out_boxplot_folder )):
          os.makedirs(out_boxplot_folder) 
      with open(path_to_boxplot_file, 'w') as f:
          json.dump(boxplot_data, f)    

  return Response(json.dumps(allTilesFeatures)) 


@app.route('/createAllGridTilesFeature')
def createAllGridTilesFeature():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  grid_size = request.args.get('gridSize', 0, type=int)

  group_data_json_string = request.args.get('grp_data', 0)

  features_file_name = request.args.get('features_file', 0)
  out_features_folder = request.args.get('features_folder', 0)   

  boxplot_file_name = request.args.get('boxplot_file', 0)
  out_boxplot_folder = request.args.get('boxplot_folder', 0)   

  path_to_features_file = os.path.join(out_features_folder, features_file_name)
  path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)

  group_data_dic = json.loads(group_data_json_string)


  print("Please wait while creating features for grids ................")

  if( api_key ):
    gc = girder_client.GirderClient(apiUrl = base_url)
    gc.authenticate(apiKey = api_key)  



  allTilesFeatures = []
  tiles_split_channel_features = []
  boxplot_data = []
  tiles_counter = 0
  error_tiles_counter = 0  

  for marker in group_data_dic:

      print(" Current channel to extract features : {} , num : {}".format(marker["frameName"], marker["frameNum"]))

      request_url = "item/" + item_id + "/tiles/region?units=base_pixels&exact=false&frame=" + str(marker["frameNum"]) + "&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"

      if( api_key ):
        girder_response = gc.get(request_url, jsonResp = False) 
      else:
        girder_response = requests.get(base_url + request_url)  

      image_raw = Image.open(io.BytesIO(girder_response.content))
      image = np.array(image_raw)

      image_width, image_height = image_raw.size 
      
      if not is_grey_scale(image):
        print("channel is not a valide gray scale image, converting  it to gray in progress... ")

        try:            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        except ValueError:  #raised if `y` is empty.
            print(' error converting channel to gray  {}'.format(ValueError))
            return jsonify("Failed");    

      # Get boxplot data for each channel
      if not (os.path.isfile(path_to_boxplot_file)): 
        df = pd.DataFrame(image.flatten(), columns=[marker["frameName"]])
        stats = df.describe()
        boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      

      tile_points = [] 
      diff_width = 0
      diff_height = 0 

      for i in range( int( math.ceil( float(image_width) / grid_size ) ) ):  # range(num) gives 0 -> num-1
            for j in range( int( math.ceil( float(image_height) / grid_size ) ) ):
                  tiles_counter += 1;
                  if(((i + 1) * grid_size) > image_width) :
                        diff_width = ( (i + 1) * grid_size ) - image_width;
                  else :
                        diff_width = 0;


                  if(((j + 1) * grid_size) > image_height) :
                        diff_height = ( (j + 1) * grid_size ) - image_height;
                  else :
                        diff_height = 0;                

                  tile_points = str(i * grid_size) + "," + str(j * grid_size) + " " + str(i * grid_size) + "," + str(((j + 1) * grid_size) - diff_width) + " " + str(((i + 1) * grid_size) - diff_height) + "," + str(((j + 1) * grid_size) - diff_width) + " " + str(((i + 1) * grid_size) - diff_height) + "," + str((j) * grid_size) + " " +  str(i * grid_size) + "," + str(j * grid_size);
                  imgTile = image[j * grid_size : ((j+1) * grid_size) - diff_height , i * grid_size : ((i+1) * grid_size) - diff_width ];
                  
                  try:            
                      tile_mean = np.mean(imgTile, axis = (0, 1));
                      tile_std = np.std(imgTile, axis = (0, 1));
                      tile_max = np.max(imgTile, axis = (0, 1));

                  except ValueError:  #raised if `y` is empty.
                      print(' invalid grid, marker {}, index  {}'.format(marker["frameName"], str(i) + "-" + str(j)))
                      error_tiles_counter += 1
                      continue

                  tiles_split_channel_features.append({"id": "grid-" + str(i) + "-" + str(j), "coordinates": tile_points, "features": {'Frame':  marker["frameName"],   'OSDLayer': marker["OSDLayer"],  'max': tile_max.tolist(),  'mean': tile_mean.tolist(),  'std': tile_std.tolist()} })
      
                  tiles_counter += 1

  print('Number of invalid cells = {}'.format(error_tiles_counter))
  print('Number of valid cells = {}'.format(tiles_counter))

  # Convert dic to dataframe to fast process big data
  df = pd.DataFrame.from_dict(tiles_split_channel_features)

  # group rows of same tile id and aggregate features key 
  df_grouped_by_id = df.groupby(['id','coordinates'])["features"].agg(lambda x: list(x) if len(x) > 1 else x.iloc[0]).reset_index()

  allTilesFeatures = df_grouped_by_id.to_dict('records')

  if not (os.path.isfile(path_to_boxplot_file)): 
      if not (os.path.isdir(out_boxplot_folder )):
          os.makedirs(out_boxplot_folder)    
      with open(path_to_boxplot_file, 'w') as f:
          json.dump(boxplot_data, f)  

  return Response(json.dumps(allTilesFeatures)) 


#  calculate channel mean, max, min, std, median, q1, q3 
@app.route('/createChannelsStatisticalData')
def createChannelsStatisticalData():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  group_data_json_string = request.args.get('grp_data', 0)

  boxplot_file_name = request.args.get('boxplot_file', 0)
  out_boxplot_folder = request.args.get('boxplot_folder', 0)   

  path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)

  group_data_dic = json.loads(group_data_json_string)

  print("Please wait while creating statistics  for group channels ................")

  if( api_key ):
    gc = girder_client.GirderClient(apiUrl = base_url)
    gc.authenticate(apiKey = api_key)  

  boxplot_data = []

  for marker in group_data_dic:

      print(" Current channel to extract features : {} , num : {}".format(marker["frameName"], marker["frameNum"]))

      request_url = "item/" + item_id + "/tiles/region?units=base_pixels&exact=false&frame=" + str(marker["frameNum"]) + "&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"

      if( api_key ):
        girder_response = gc.get(request_url, jsonResp = False) 
      else:
        girder_response = requests.get(base_url + request_url)  

      image_raw = Image.open(io.BytesIO(girder_response.content))
      image = np.array(image_raw)

      if not is_grey_scale(image):
        print("channel is not a valide gray scale image, converting  it to gray in progress... ")

        try:            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        except ValueError:  #raised if `y` is empty.
            print(' error converting channel to gray  {}'.format(ValueError))
            return jsonify("Failed");    

      # Get boxplot data for each channel

      df = pd.DataFrame(image.flatten(), columns=[marker["frameName"]])
      stats = df.describe()
      boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      



  if not (os.path.isdir(out_boxplot_folder )):
      os.makedirs(out_boxplot_folder)  
  with open(path_to_boxplot_file, 'w') as f:
      json.dump(boxplot_data, f)  

  return Response(json.dumps(boxplot_data))   
      


@app.route('/checkFile')              #----------------------Ok---------------------#
def checkFile():
 file_name = request.args.get('filename', 0)
 out_folder = request.args.get('outfolder', 0)
 path_to_file = os.path.join(out_folder, file_name)

 if (os.path.isfile(path_to_file)):  
  return "true"
 else:
  return "false"

@app.route('/removeFile')         #----------------------Ok---------------------#
def removeFile():
 file_name = request.args.get('filename', 0)
 out_folder = request.args.get('outfolder', 0)
 path_to_file = os.path.join(out_folder, file_name)

 if (os.path.isfile(path_to_file)): 
    os.remove(path_to_file) 

 if os.path.exists(path_to_file):    
    return "false"
 else:
    return "true"  
   


@app.route('/saveFeatures')     #----------------------Ok---------------------#
def saveFeatures():
  xfeatures = request.args.get('featuresDicData', 0)
  xlastChunkFlag = request.args.get('lastChunkFlag', 0, type=int)
  xfilename = request.args.get('name', 0)
  xmode = request.args.get('mode', 0)
  xDirPath = request.args.get('Dir', 0)

  if (os.path.isdir(xDirPath ) == False):
   os.makedirs(xDirPath) 

  if(xmode == "w"):   
    file = open(xDirPath + xfilename, xmode)  
    file.write(xfeatures)
    file.close()
    if os.path.isfile(xDirPath + xfilename):
     return "saved"
    else:
     return "failed" 
  else:
    if(xlastChunkFlag == -1):
      if (os.path.isfile(xDirPath + xfilename)):  
        os.remove(xDirPath + xfilename)  

    file = open(xDirPath + xfilename, xmode)  
    file.write(xfeatures)
    file.close()

    if(xlastChunkFlag == 1):
      if (os.path.isfile(xDirPath + xfilename)):  
        return "saved"
      else:
        return "failed"
    return "Waiting file to merge" 


@app.route('/getRGBHist')
def getRGBHist():
  
   Dic1={'dleft':'','dtop':'','dWidth':'', 'dHeight':'', 'durl':'', 'red':'', 'green':'', 'blue':'', 'bin':''}  ;
   xleft = request.args.get('left', 0, type=int)
   xtop = request.args.get('top', 0, type=int)
   xWidth = request.args.get('Width', 0, type=int)
   xHeight = request.args.get('Height', 0, type=int)
   xBaseUrl = request.args.get('BaseUrl', 0)
   xId = request.args.get('id', 0)

   xAuthentication = request.args.get('Authentication', 0, type=int)
   xDSA_User= request.args.get('DSA_User', 0)
   xPassword = request.args.get('Password', 0)

   Dic1['dleft']=xleft
   Dic1['dtop']=xtop
   Dic1['dWidth']=xWidth
   Dic1['dHeight']=xHeight

   imageurl="/item/"+xId+"/tiles/region?left="+str(xleft)+"&top="+str(xtop)+"&regionWidth="+str(xWidth)+"&regionHeight="+str(xHeight)+"&units=base_pixels&exact=false&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"  
   
   Dic1['durl']=xBaseUrl+imageurl
   if(xAuthentication):
     gc = girder_client.GirderClient(apiUrl=xBaseUrl)
     gc.authenticate(username=xDSA_User, password=xPassword)
     response = gc.get(imageurl, jsonResp=False)
   else:
     response = requests.get(xBaseUrl+imageurl)
   img = Image.open(BytesIO(response.content))
   imarr=np.array(img)
   num_hist_bins = request.args.get('Bins', 0, type=int)
   tile_hist = {}
   tile_hist['red'] = np.histogram(imarr[:, :, 0], bins=num_hist_bins, range=(0, 255), density=True)[0]    
   tile_hist['green'] = np.histogram(imarr[:, :, 1], bins=num_hist_bins, range=(0, 255), density=True)[0]    
   tile_hist['blue'] = np.histogram(imarr[:, :, 2], bins=num_hist_bins, range=(0, 255), density=True)[0]
   Dic1['bin']=num_hist_bins
   Dic1['red']=tile_hist['red'].tolist()
   Dic1['green']=tile_hist['green'].tolist()
   Dic1['blue']=tile_hist['blue'].tolist()
   return Response(json.dumps(Dic1))    


@app.route('/getH5Features')
def readDeEnFeatures():
  Dic={'index':'','features':'', 'x_cent':'', 'y_cent':''} ;
  allfeatures=[];
  xfilename = request.args.get('name', 0)
  xoutfolder = request.args.get('outfolder', 0)
  print("xfilename")
  print(xfilename)
  if (os.path.isdir(xoutfolder)==True):
   if (os.path.isfile(xoutfolder+xfilename+'.h5')==True):  
    data=h5py.File(xoutfolder+xfilename+'.h5',"r") 
    
    numOfSpx=len(data['features'])
    featEntryLen=len( data['features'][0].tolist()) 
    for i in range(numOfSpx):
     Dic['index']=i
     Dic['features']=data['features'][i].tolist()
     Dic['x_cent']=data['x_centroid'][i].tolist()
     Dic['y_cent']=data['y_centroid'][i].tolist()
     allfeatures.append(Dic.copy())
    print("allfeatures[0]")
    print(allfeatures[0])
    print("allfeatures[10]")
    print(allfeatures[10])
    return  Response(json.dumps(allfeatures))
   else:
    return "Notexist"
  else:
   return "Notexist" 

@app.route('/getTileProp')
def getTileProp():
   tile_prop_list = { 'mean': '', 'max': '', 'std': ''}  # Should be the same as defined into mainParameters  featureKeys=["mean","max","std"] 
   left = request.args.get('left', 0, type=int)
   top = request.args.get('top', 0, type=int)
   width = request.args.get('width', 0, type=int)
   height = request.args.get('height', 0, type=int)
   frame_num = request.args.get('frameNum', 0, type=int)
   base_url = request.args.get('baseUrl', 0)
   item_id = request.args.get('itemId', 0)
   api_key = request.args.get('apiKey', 0)

   frame_url = "/item/" + item_id + "/tiles/region?left=" + str(left) + \
               "&top=" + str(top) + "&regionWidth=" + str(width) + "&regionHeight=" + str(height) + \
               "&units=base_pixels&exact=false&frame=" + str(frame_num) + "&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"  
   
   gc = girder_client.GirderClient(apiUrl = base_url)

   if( api_key ):
      gc.authenticate(apiKey = api_key)  
      response = gc.get(frame_url, jsonResp=False) 
   else:
     response = requests.get(base_url + frame_url)

   tile = Image.open(BytesIO(response.content))
   tile_array = np.array(tile)
   tile_prop = { 'mean': '', 'max': '', 'std': ''}
   tile_prop['rgb_mean'] = np.mean(tile_array, axis=(0, 1))   
   tile_prop['std'] = np.std(tile_array,axis=(0, 1));
   tile_prop['max'] = np.max(tile_array,axis=(0, 1));
   tile_prop_list['mean'] = tile_prop['rgb_mean'].tolist()
   tile_prop_list['max'] = tile_prop['max'].tolist()
   tile_prop_list['std'] = tile_prop['std'].tolist()
   # print(" tile_pro_ list", tile_prop_list)
   return Response(json.dumps(tile_prop_list))    # convert tile_prop_list to JSON


@app.route('/getImage')
def getImage():
  user = {'sampleOutput': ''}
  xleft = request.args.get('left', 0, type=int)
  xtop = request.args.get('top', 0, type=int)
  xWidth = request.args.get('Width', 0, type=int)
  xHeight = request.args.get('Height', 0, type=int)
  xindex = request.args.get('index', 0)
  xBaseUrl = request.args.get('BaseUrl', 0)
  xId = request.args.get('id', 0)

  xAuthentication = request.args.get('Authentication', 0, type=int)
  xDSA_User= request.args.get('DSA_User', 0)
  xPassword = request.args.get('Password', 0)

  currentURL = "/item/"+xId+"/tiles/region?left="+str(xleft)+"&top="+str(xtop)+"&regionWidth="+str(xWidth)+"&regionHeight="+str(xHeight)+"&units=base_pixels&exact=false&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"
  if(xAuthentication):
    gc = girder_client.GirderClient(apiUrl=xBaseUrl)
    gc.authenticate(username=xDSA_User, password=xPassword)
    response = gc.get(currentURL, jsonResp=False)
  else:
    response = requests.get(xBaseUrl+currentURL)
  img = Image.open(BytesIO(response.content))

  if (os.path.isdir('temp')==False):
   os.mkdir('temp') 
  if len(os.listdir('temp') ) != 0:
    files = glob.glob('temp/*')
    for f in files:
     remove(f)
  imagepath='temp/temp'+xindex+'.jpg';
  img.save(imagepath)
  img = Image.open(imagepath)
  text = image_to_string(img) #perform ocr on the tailored image
  text = re.sub('([^0-9a-zA-Z\:\s\/])+','', text)
  text = re.sub('\.',' ', text)
  text = re.sub('(\s{1,}|\n)',' ',text)
  text =re.sub(r'.(?i)*Fox', 'Fox', text)
  if  text[0:3] != 'Fox':
    text = re.sub(r'.(?i)*Col', 'Col', text)
    return "Image saved correctly"        
  else: 
    print ('fail')
    return "failed"

@app.route('/uploadDSAFormat')
def uploadDSAFormat():
  xBaseUrl = request.args.get('BaseUrl', 0)
  xId = request.args.get('id', 0)

  xAuthentication = request.args.get('Authentication', 0, type=int)
  xDSA_User= request.args.get('DSA_User', 0)
  xPassword = request.args.get('Password', 0)

  xmode = request.args.get('mode', 0)
  xlastChunkFlag = request.args.get('lastChunkFlag', 0, type=int)

  xDSAFormatData = request.args.get('DSAFormatData', 0)

  gc = girder_client.GirderClient(apiUrl=xBaseUrl)
  gc.authenticate(apiKey='SOYgm8xbBZ46T9p4oPUXrjFEDU9xErAaWcP5jexz')

  if(xAuthentication):   
     gc.authenticate(username=xDSA_User, password=xPassword)

  if(xmode=="w"):   
    response = gc.post("annotation?itemId=" + xId, json=json.loads(xDSAFormatData))
    return "uploaded"
  else:
    if(os.path.isdir('DSAFormat')==False):
      os.mkdir('DSAFormat') 
    if(xlastChunkFlag==-1):
      if (os.path.isfile("DSAFormat/tempFile.txt")==True):  
        os.remove("DSAFormat/tempFile.txt") 

    file=open("DSAFormat/tempFile.txt",xmode)  
    file.write(xDSAFormatData)
    file.close()
    
    if(xlastChunkFlag==1):
      if (os.path.isfile("DSAFormat/tempFile.txt")==True):  
        file=open("DSAFormat/tempFile.txt","r")  
        allChunks=file.read()
        file.close()
      
        response = gc.post("annotation?itemId=" + xId, json=json.loads(allChunks))
        os.remove("DSAFormat/tempFile.txt")
        return "Merging completed and uploaded for that chunk"
      else:
        return "No temp file found"  

    return "Not uploaded need merging"

@app.route('/downloadFile')             #----------------------Ok---------------------#
def downloadFile():
  base_url = request.args.get('baseUrl', 0)
  request_url = request.args.get('requestUrl', 0)
  out_folder = request.args.get('outfolder', 0)
  file_name = request.args.get('filename', 0)
  api_key = request.args.get('apiKey', 0)

  gc = girder_client.GirderClient(apiUrl = base_url)

  if( api_key ):
      gc.authenticate(apiKey = api_key)


  if not os.path.isdir(out_folder):
      os.makedirs(out_folder)

  download_path = os.path.join(out_folder, file_name)

  if not os.path.isfile(download_path):
      curFile = gc.get( request_url, jsonResp = False)
      with open(download_path, "w") as fp:
          fp.write( curFile.content )
          return curFile.content
  else:
      return "File exists"

@app.route('/saveDSAFormat')
def saveDSAFormat():
  xDSAFormatData = request.args.get('DSAFormatData', 0)
  xlastChunkFlag = request.args.get('lastChunkFlag', 0, type=int)
  xfilename = request.args.get('name', 0)
  xDirPath = request.args.get('Dir', 0)
  xmode = request.args.get('mode', 0)
  if (os.path.isdir("DSAFormat/"+xDirPath )==False):
   os.makedirs("DSAFormat/"+xDirPath) 

  if(xmode=="w"):   
    file=open("DSAFormat/"+xDirPath+xfilename,xmode)  
    file.write(xDSAFormatData)
    file.close()
    if os.path.isfile("DSAFormat/"+xDirPath+xfilename):
     return "saved"
    else:
     return "failed" 
  else:
    if(xlastChunkFlag==-1):
      if (os.path.isfile("DSAFormat/"+xDirPath+xfilename)):  
        os.remove("DSAFormat/"+xDirPath+xfilename)  

    file=open("DSAFormat/"+xDirPath+xfilename,xmode)  
    file.write(xDSAFormatData)
    file.close()

    if(xlastChunkFlag==1):
      if (os.path.isfile("DSAFormat/"+xDirPath+xfilename)):  
        return "saved"
      else:
        return "failed"
    return "Waiting file to merge"      

 
if __name__ == "__main__":
	app.run(debug=True,threaded=True,host='0.0.0.0', port=5000)







