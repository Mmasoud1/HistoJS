#=========================================================
#* HistoJS Demo - v1.0.0  | 2020
#=========================================================
#
# Github:  https://github.com/Mmasoud1
# Description:  A user interface for whole slide image channel design and analysis. 
#               It is based on DSA as backbone server.
# 
#
# Coded by Mohamed Masoud ( mmasoud2@outlook.com )
#
#=========================================================
#
#=========================================================
#                      Rest Api
#=========================================================
#
#!env/bin/python
from __future__ import print_function, unicode_literals, absolute_import, division
from stardist.models import StarDist2D 
from flask import Flask, request, Response,  render_template, jsonify
from flask_cors import CORS
import json
import girder_client
import PIL
from PIL import Image, ImageFile
import os,sys,io
from io import BytesIO 
import numpy as np
import re
import requests
from os import remove
import os
import glob
import h5py
import cv2
import base64
from csbdeep.utils import Path, normalize
from csbdeep.io import save_tiff_imagej_compatible
from stardist import random_label_cmap, _draw_polygons, export_imagej_rois
from sklearn.preprocessing import MinMaxScaler   
from skimage import data, img_as_float
from skimage import measure
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from scipy.ndimage import find_objects
from scipy.spatial import Delaunay, ConvexHull, convex_hull_plot_2d
from skimage import measure
from skimage.measure import label, regionprops, approximate_polygon
from collections import defaultdict
import itertools
import pandas as pd
import math
import codecs
from tqdm import tqdm
import matplotlib.pyplot as plt
import seaborn as sns
if sys.version_info[0] < 3: 
    from StringIO import StringIO
else:
    from io import StringIO

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

# @app.route('/readBoundaries')
# def readBoundaries():
#   file_name = request.args.get('filename', 0)
#   out_folder = request.args.get('outfolder', 0)  
#   path_to_file = os.path.join(out_folder, file_name)
#   print("Please wait while reading boundaries file .....", path_to_file)
#   if (os.path.isfile(path_to_file)):  
#     file = open(out_folder + file_name, "r")  
#     boundaries = file.read()
#     file.close()
#     return boundaries
#   else:
#     return "notExist" 

#-------------------------------------------------------------------------------#
############################## Boundaries from Dapi #############################
#-------------------------------------------------------------------------------#

# Scale contour, resize it smaller or larger to include for the example the cytoplasom
def scale_contour(cnt, scale):
    M = cv2.moments(cnt)
    cx = int(M['m10']/M['m00'])
    cy = int(M['m01']/M['m00'])

    cnt_norm = cnt - [cx, cy]
    cnt_scaled = cnt_norm * scale
    cnt_scaled = cnt_scaled + [cx, cy]
    cnt_scaled = cnt_scaled.astype(np.int32)

    return cnt_scaled


# source code inspired from cellpose 
def masks_to_outlines(masks):

    if masks.ndim > 3 or masks.ndim < 2:
        raise ValueError('masks_to_outlines takes 2D or 3D array, not %dD array'%masks.ndim)
    outlines = np.zeros(masks.shape, np.bool)
    
    if masks.ndim==3:
        for i in range(masks.shape[0]):
            outlines[i] = masks_to_outlines(masks[i])
        return outlines
    else:
        slices = find_objects(masks.astype(int))
        for i,si in enumerate(slices):
            if si is not None:
                sr,sc = si
                mask = (masks[sr, sc] == (i+1)).astype(np.uint8)
                contours = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
                pvc, pvr = np.concatenate(contours[-2], axis=0).squeeze().T            
                vr, vc = pvr + sr.start, pvc + sc.start 
                outlines[vr, vc] = 1
        return outlines


@app.route('/createBoundariesFromDapiChannel')
def createBoundariesFromDapiChannel():

  #Flag to determine which approach to extract boundaries from mask ie. contour based or regionprops based
  # if contour approach is False then regionprops will be used 
  is_boundary_extraction_contours_based = request.args.get('isBoundaryExtractionContoursBased', type=bool)
  print("Boundary extraction is contours based: ", is_boundary_extraction_contours_based)

  # if remove outliers is need
  is_remove_outliers_required = request.args.get('isRemoveOutliersRequired', type=bool)
  print("Remove outliers is required: ", is_remove_outliers_required)

  # if removing all outliers of all morphologies  are need
  all_features_outliers_considered = request.args.get('allFeaturesOutliersConsidered', type=int)
  print("Remove all Features outliers is required: ", all_features_outliers_considered)  

  reset_boundaries_label_after_outlier_filter = request.args.get('resetBoundaryLabelAfterOutlierFilter', type=bool)
  print("Reset boundaries label after outlier filter: ", reset_boundaries_label_after_outlier_filter)

  approximation_requested = request.args.get('contourApproxRequest', type=bool)
  print("approximation_requested: ", approximation_requested)

  use_95_05_percentile = request.args.get('use95_05Percentile', type=bool)
  percentile_lower = float(request.args.get('percentileLower', 0))
  percentile_upper = float(request.args.get('percentileUpper', 0))
  print("use_95_05_percentile requested: ", use_95_05_percentile)
  if use_95_05_percentile:
    print("percentile_lower requested: ", percentile_lower)
    print("percentile_upper requested: ", percentile_upper)

  file_name = request.args.get('filename', 0)
  out_folder = request.args.get('outfolder', 0)  
  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  dapi_ch_index = request.args.get('dapiChannelIdx', type=int)
  print("dapi_ch_index: ", dapi_ch_index)

  contour_scale_factor = float(request.args.get('contourScaleFactor', 0))
  print("contour scale factor: ", contour_scale_factor)

  contour_approx_factor = float(request.args.get('nuclContourApproxFactor', 0))
  print("contour approximation factor: ", contour_approx_factor)

  invalid_nucl_area_threshold = request.args.get('invalidNuclAreaThreshold', type=int)
  print("invalid nucl area threshold: ", invalid_nucl_area_threshold)

  # is_boundary_extraction_contours_based = False

  # is_remove_outliers_required = True

  # all_features_outliers_considered = False

  # reset_boundaries_label_after_outlier_filter = True    

  raw_contours_file_name = file_name.split(".json")[0] + '_raw_contours.json'
  # cells_label_file_name = file_name.split(".json")[0] + '_labels.json'
  
  if (not os.path.isfile(out_folder + raw_contours_file_name)) or (not is_boundary_extraction_contours_based):

    print("Please wait while creating boundaries from Dapi Channel ................")

    request_url = "item/" + item_id + "/tiles/region?units=base_pixels&exact=false&frame=" + str(dapi_ch_index) + "&encoding=JPEG&jpegQuality=95&jpegSubsampling=0"
     
    gc = girder_client.GirderClient(apiUrl = base_url)

    if( api_key ):
        gc.authenticate(apiKey = api_key)  
        girder_response = gc.get(request_url, jsonResp=False) 
    else:
        girder_response = requests.get(base_url + request_url)  

    dapi_channel_raw = Image.open(io.BytesIO(girder_response.content))
    dapi_channel = np.array(dapi_channel_raw)    

    # Check or Convert to grey scale channel
    dapi_channel_gray = []
    if  len(dapi_channel.shape) > 2 :
        dapi_channel_gray = cv2.cvtColor(dapi_channel, cv2.COLOR_BGR2GRAY)
        dapi_channel =  dapi_channel_gray


    n_channel = 1 if dapi_channel.ndim == 2 else dapi_channel.shape[-1]
    axis_norm = (0,1)   # normalize channels independently

    if n_channel > 1:
        print("Normalizing image channels %s." % ('jointly' if axis_norm is None or 2 in axis_norm else 'independently'))

    # Normalize channel
    dapi_channel_norm = normalize(dapi_channel, 1,99.8, axis=axis_norm)
    print("Dapi normalization done..")

    # creates a pretrained model
    model = StarDist2D.from_pretrained('2D_versatile_fluo')

    # Get labels and polys for the image/ DAPI channel
    dapi_channel_labels, dapi_channel_polys = model.predict_instances_big(dapi_channel_norm, axes='YX', block_size=4096, min_overlap=128, context=128, n_tiles=(4,4))
    print("Dapi labels prediction done..")

    ##  Convert starDist polys to contours 
    ### Method #1 to convert (faster)
    print("Convert dapi channel polys to contours in progress..")
    contours = []
    for poly in tqdm(dapi_channel_polys['coord']):
        merge_coord = list(zip(poly[1], poly[0]))

        contours.append(np.around(merge_coord).astype(int))    
    print("Total number of converted dapi channel polys--> contours : {}".format(len(contours))) 

    # save  contours array as Json
    if not (os.path.isdir(out_folder)):
      os.makedirs(out_folder)        
    contours_arr = np.asarray(contours)
    contours_list = contours_arr.tolist()
    json.dump(contours_list, codecs.open(out_folder + raw_contours_file_name, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4) 


    # save  labels array as Json
    # contours_arr = np.asarray(contours)
    # contours_list = contours_arr.tolist()
    # json.dump(contours_list, codecs.open(out_folder + raw_contours_file_name, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4) 


  else:
    # if is_boundary_extraction_contours_based: 
    print("Wait reading raw contours from saved json file")

    contours_text = codecs.open(out_folder + raw_contours_file_name, 'r', encoding='utf-8').read()
    contours_json = json.loads(contours_text)
    contours = list(np.array(contours_json))

  # else:
  #    print("Wait reading labels from saved json file")
  #    labels_text = codecs.open(out_folder + cells_label_file_name, 'r', encoding='utf-8').read()
  #    labels_json = json.loads(labels_text)
  #    dapi_channel_labels = list(np.array(labels_json)) 


  # if there is a need to scale countour to enlarge or shrink it 
  if contour_scale_factor != 1:
    print("Contours scaling in progress..")
    scaled_contours = []

    for cont in tqdm(contours):
        scaled_contours.append(scale_contour(cont, contour_scale_factor))  
    
    contours = scaled_contours
  
  #check if contours need reverse order
  # mask_height = dapi_channel.shape[0]
  # mask_width = dapi_channel.shape[1]

  # contours_reverse_flag = True

  # polygon = Polygon([(0, 0), (0, mask_width/2), (mask_height/2, mask_width/2), (mask_height/2, 0)])

  # for vertex in contours[0]:
  #     point = Point(vertex[0][0], vertex[0][1])
  #     if polygon.contains(point) :
  #         contours_reverse_flag = False

  # if contours_reverse_flag :
  #     contours.reverse()         


  # Get contours/Regions properties
  maskBoundariesData = []
  idx = 1

  if all_features_outliers_considered:
      features_to_remove_outliers = ['area', 'eccentricity', 'extent', 'major_axis_length', 'minor_axis_length', 'orientation', 'perimeter', 'solidity']
  else:
      features_to_remove_outliers = ['area', 'perimeter']
  #     features_to_remove_outliers = ['area']    

  if is_boundary_extraction_contours_based:

      nearest_decimal = 2
      invalid_contour_num = 0
      # Conversion loop 
      for contour in tqdm(contours):
          spxBoundaries = []
          if approximation_requested :
              approx = cv2.approxPolyDP(contour, contour_approx_factor * cv2.arcLength(contour, True), True) 
              cnt = approx
          else:
              cnt = contour
          # check for valid vertex
          invalid_vertex = False    
          if len(cnt) > 2 :
              for vertex in cnt:
                  spxBoundaries.append(str(vertex[0][0]) + ',' + str(vertex[0][1])) 
                  if (vertex[0][0] < 0) or (vertex[0][1] < 0):
                    invalid_vertex = True
              if invalid_vertex:
                invalid_contour_num += 1
                continue
                    
          else:
              continue

          # compute the center of the contour
          M = cv2.moments(contour)    
          if M["m00"] != 0:
              x_cent = int(M["m10"] / M["m00"])
              y_cent = int(M["m01"] / M["m00"])
          else:
              # set values as what you need in the situation
              #print(cnt)
      #         x_cent, y_cent = 0, 0
              continue

      #     maskBoundariesData.append({"label": idx, "x_cent": x_cent, "y_cent": y_cent, "spxBoundaries":' '.join(spxBoundaries)  })
      #     idx += 1

          # contour area
          area = round(cv2.contourArea(contour), nearest_decimal)

          if area < invalid_nucl_area_threshold :
            continue


          # contour perimeter    
          perimeter = round(cv2.arcLength(contour,True), nearest_decimal)

          #Extent is the ratio of contour area to bounding rectangle area.
          x,y,w,h = cv2.boundingRect(contour)
          rect_area = w*h
          extent = round( float(area)/rect_area, nearest_decimal)   

          #calculating Solidity and eccentricity  
          #Solidity is the ratio of contour area to its convex hull area.
          ## Usually Tumor has higher solidity value than normal tissue        
          # If the eccentricity is one, it will be a straight line and if it is zero, it will be a perfect circle
          try:
              ## For Solidity we need to calculate hull area first
              hull = cv2.convexHull(contour)
              hull_area = cv2.contourArea(hull)
              
              ## center, axis_length and orientation of ellipse
              (center, axes, orientation)  =  cv2.fitEllipse(contour)
          except:
              #print("An exception occurred during calculating eccentricity") 
              continue  

          solidity = round( float(area)/hull_area, nearest_decimal)             
          major_axis_length = round( max(axes), nearest_decimal)
          minor_axis_length = round( min(axes), nearest_decimal)

          ## eccentricity = sqrt( 1 - (ma/MA)^2) --- ma= minor axis --- MA= major axis
          eccentricity = round( np.sqrt(1-(minor_axis_length/major_axis_length)**2), nearest_decimal)  


          # area, eccentricity, solidity, extent , euler_number, perimeter, major_axis_length, minor_axis_length,    centroid, orientation   

          maskBoundariesData.append({"label": idx, "area": area, "eccentricity": eccentricity, "orientation": round(orientation, nearest_decimal),  "perimeter" : perimeter, "extent": extent, "solidity": solidity, "major_axis_length": major_axis_length, "minor_axis_length": minor_axis_length,  "x_cent": x_cent, "y_cent": y_cent, "neighbors": None, "spxBoundaries":' '.join(spxBoundaries)  })
          idx += 1

      print(' Num of invalid contour found:  {}'.format(invalid_contour_num))    

  #------------------------------------------------------------------------------------------------------#         
  #-----------------------------------------Region based boundaries -------------------------------------#  
  #------------------------------------------------------------------------------------------------------# 
  # boundaries are regionprops based, but the points can be very large, need approximation  
  else:    
      print("regionprops based cell morphology calculations: ")
      print("Please wait ...")
      props = measure.regionprops(dapi_channel_labels)
      
      invalid_region_num = 0
      invalid_area_num = 0      
      # Conversion loop 
      for  prop in tqdm(props):

          spxBoundaries  = []

          try:
              # to get the boundaries, get convex hull of region points (prop.coords is area points not perimeter point) 
              hull = ConvexHull(prop.coords)
              hull_indices = hull.vertices
              hull_pts = prop.coords[hull_indices, :]   
          except:
              continue         

          if approximation_requested :
              approx =  approximate_polygon(hull_pts, tolerance = 1.5) 
          else:     
              approx = hull_pts

          invalid_vertex = False
          for vertex in approx:        
              spxBoundaries.append(str(vertex[1]) + ',' + str(vertex[0])) 
              if (vertex[1] < 0) or (vertex[0] < 0):
                invalid_vertex = True
          if invalid_vertex:
            invalid_region_num += 1
            continue  

          if prop.area < invalid_nucl_area_threshold:
            invalid_area_num += 1
            continue                          


          maskBoundariesData.append({"label": idx, "area":  prop.area, "eccentricity": prop.eccentricity, "solidity": prop.solidity, "extent":  prop.extent, "perimeter": prop.perimeter, "major_axis_length":  prop.major_axis_length, "minor_axis_length": prop.minor_axis_length, "orientation": math.degrees(prop.orientation),  "x_cent": round(prop.centroid[1]), "y_cent": round(prop.centroid[0]),  "spxBoundaries":' '.join(spxBoundaries) })
          idx += 1    
 
      print(' Num of invalid region found:  {}'.format(invalid_region_num))  
      print(' Num of invalid areas found:  {}'.format(invalid_area_num))            

  if len(maskBoundariesData):   
      # if remove outliers option is set
      if is_remove_outliers_required:
          print("Wait for outliers to remove ...")
          df = pd.DataFrame.from_dict(maskBoundariesData)
          df_after_filter = df
          
          for feature in features_to_remove_outliers:
              if use_95_05_percentile:
                  P_lower = df[feature].quantile(percentile_lower)
                  P_upper = df[feature].quantile(percentile_upper)
                  filter = (df_after_filter[feature] >= P_lower) & (df_after_filter[feature] <= P_upper)
              else:    
                  Q1 = df[feature].quantile(0.25)
                  Q3 = df[feature].quantile(0.75)
                  IQR = Q3 - Q1    #IQR is interquartile range. 
                  filter = (df_after_filter[feature] >= Q1 - 1.5 * IQR) & (df_after_filter[feature] <= Q3 + 1.5 *IQR)

              df_after_filter = df_after_filter.loc[filter]  
              
          maskBoundariesData_update = df_after_filter.to_dict('records')
          # reset labels to start from 1 to len(maskBoundariesData_update
          if reset_boundaries_label_after_outlier_filter:
              for index, item in enumerate(maskBoundariesData_update):
                  item['label'] = index +1
      else:   
          maskBoundariesData_update = maskBoundariesData

      
      
      # convert x_cent and y_cent to array of points
      print("Wait while calculating neighbors ...")
      all_points = [];

      for contour in maskBoundariesData_update:
          all_points.append([contour['x_cent'], contour['y_cent']]);


      tri = Delaunay(all_points)
      neiList = defaultdict(set)
      for p in tri.vertices:
          for i,j in itertools.combinations(p,2):
              neiList[i].add(j)
              neiList[j].add(i)


      for key in sorted(neiList.keys()):
          neighbor_array = list(neiList[key])
          for index in range(len(neighbor_array)):
              neighbor_array[index] += 1
          # maskBoundariesData_update[key]['neighbors'] = neighbor_array    
          # we need to convert to np.arrary and then to list again to overcome the issue of :
          # TypeError: Object of type int64 is not JSON serializable
          maskBoundariesData_update[key]['neighbors'] =(np.array(neighbor_array, dtype=np.int32)).tolist()
      # Verify the created file    
      print('Total num of extracted boundaries :',len(maskBoundariesData_update))
      print('Total num of contours :',len(contours))


      # Create Json file 
      if not (os.path.isdir(out_folder)):
              os.makedirs(out_folder)  
      with open(out_folder + file_name, 'w') as f:
          json.dump(maskBoundariesData_update, f)  
      

      if (os.path.isfile(out_folder + file_name)):  
        return "Created successfully"
      else:
        return "Failed"               

#-------------------------------------------------------------------------------#
############################## Boundaries from Mask #############################
#-------------------------------------------------------------------------------#

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
  
  print(' Number of invalid contours : ', num_of_invalid_contours)

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


def str_to_array(points):
    pair_points = []
    
    for px in points.split(" "):
        if sys.version_info[0] < 3:
          # For python 2
            pair_points.append(map(int, px.split(",")))
        else:
          # For python 3          
            pair_points.append(list(map(int, px.split(","))))
    
    return pair_points



@app.route('/createDapiCellsMorphStatData')
def createDapiCellsMorphStatData():

  print("Find statistics of morphology features e.g. area,..")
  dapi_morph_stats_file_name = request.args.get('dapi_morph_stats_file', 0)
  item_features_folder = request.args.get('item_features_folder', 0) 

  boundaries_file_name = request.args.get('boundaries_file', 0)
  boundaries_folder = request.args.get('boundaries_folder', 0)    

  basic_morph_features_string= request.args.get('morph_feature_names_arr', 0)  


  path_to_dapi_morph_stats_file = os.path.join(item_features_folder, dapi_morph_stats_file_name)
  path_to_boundaries_file = os.path.join(boundaries_folder, boundaries_file_name)

  # read cell morphology file having cells boundary, area, extent .. etc
  df_cell_morphology = pd.read_json(path_to_boundaries_file) 

  # Find statistical data 
  morphology_states = df_cell_morphology.describe()

  # basic_morph_features should be ['area', 'eccentricity', 'extent', 'orientation', 'solidity', 'major_axis_length', 'minor_axis_length']
  # Refere to cellMorphFeatureList  with  mainParametersV3.js file for more details
  basic_morph_features = json.loads(basic_morph_features_string)

  all_basic_morph_feat_States = {}  

  for morph_feature in basic_morph_features:
      all_basic_morph_feat_States[morph_feature] = {"mean" : morphology_states[morph_feature]['mean'], 
                                              "std" : morphology_states[morph_feature]['std'],
                                              "min" : morphology_states[morph_feature]['min'],
                                              "25%" : morphology_states[morph_feature]['25%'],
                                              "50%" : morphology_states[morph_feature]['50%'],
                                              "75%" : morphology_states[morph_feature]['75%'],
                                              "max" : morphology_states[morph_feature]["max"]}


  print('Save all_basic_morph_feat_States to json file...')
  with open(path_to_dapi_morph_stats_file, 'w') as f:
     json.dump(all_basic_morph_feat_States, f)


  return Response(json.dumps(all_basic_morph_feat_States)) 



@app.route('/classifyCellsWithMaxIntensity')
def classifyCellsWithMaxIntensity():

  print("Classify cells based on thier intensity..")
  markers_morph_file_name = request.args.get('markers_morph_file', 0)  
  out_features_folder = request.args.get('features_folder', 0) 
  chnl_name_type_json_string = request.args.get('chnl_name_type', 0)
  cell_feature_to_normalize = request.args.get('cellFeatureToNormalize', 0)

  # cell_undefined_threshold_value can be e.g. mean or "50%"
  cell_undefined_threshold_value = request.args.get('cell_undefined_threshold_value', 0)

  path_to_markers_morph_file = os.path.join(out_features_folder, markers_morph_file_name)    
  
  print('Read markers morphology csv file...')  

  df_cell_markers_morphology = pd.read_csv(path_to_markers_morph_file)

  chnl_name_type_dic = json.loads(chnl_name_type_json_string)


  # Normalize marker mean values
  print('Normalizing markers in progress...')
  markers_norm_col = []
  for marker in chnl_name_type_dic:
      markers_norm_col.append(marker["Frame"]+"_norm")
      df_cell_markers_morphology[marker["Frame"]+"_norm"] = df_cell_markers_morphology[marker["Frame"] + cell_feature_to_normalize ].transform(lambda x: (x-x.mean())/x.std()).fillna(-1)#.reset_index()
  # scale marker normalized values to the range from 0-255
  sc = MinMaxScaler(feature_range=(0, 255))        
  df_cell_markers_morphology[markers_norm_col] = sc.fit_transform(df_cell_markers_morphology[markers_norm_col])

  # Get statistical values e.g. mean, min,  max, "25%", "50%" ,"75%",  std  for each normalized marker e.g. CD45
  norm_mark_stats = df_cell_markers_morphology[markers_norm_col].describe()

  # Create dataframe with selected columns to classify
  df_selected_markers_normalized = pd.DataFrame()
  df_selected_markers_normalized['id'] = df_cell_markers_morphology['id']
  df_selected_markers_normalized[markers_norm_col] = df_cell_markers_morphology[markers_norm_col]
  df_selected_markers_normalized['Max'] = df_selected_markers_normalized[markers_norm_col].idxmax(axis=1)  

  # Filter cells with 2 phases: 
  # 1- first find the marker of the max intensity value
  for marker in chnl_name_type_dic:
      df_selected_markers_normalized.loc[df_selected_markers_normalized['Max'] == marker["Frame"]+"_norm", 'Type'] = marker["Type"]  

  # 2- classify as undefined or Others for any cell with markers values below the threshold cell_undefined_threshold_value
  rslt_df = df_selected_markers_normalized
  for marker in chnl_name_type_dic:
      rslt_df = rslt_df[rslt_df[marker["Frame"]+"_norm"]< norm_mark_stats[marker["Frame"]+"_norm"][cell_undefined_threshold_value]]

  df_selected_markers_normalized.loc[rslt_df.index , 'Type'] = 'Others' 



  print("Converting cells classification  dataframe to compatible histojs dictionary ..")
  dict_cell_classification = df_selected_markers_normalized.to_dict('records')
  
  for cell in dict_cell_classification:
      cell['label'] = cell['id']
      cell['id'] = "spx-" + str(cell["id"])

  return Response(json.dumps(dict_cell_classification))   


@app.route('/createAllSpxTilesFeature')
def createAllSpxTilesFeature():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  is_channel_normalize_required = request.args.get('isChannelNormalizeRequired', 0, type=bool)

  cell_feature_to_normalize = request.args.get('cellFeatureToNormalize', 0)

  group_data_json_string = request.args.get('grp_data', 0)

  # e.g. "Structural Components__markers_morphology.csv"
  markers_morph_file_name = request.args.get('markers_morph_file', 0)

  features_file_name = request.args.get('features_file', 0)
  out_features_folder = request.args.get('features_folder', 0)    

  # boxplot_file_name = request.args.get('boxplot_file', 0)
  # out_boxplot_folder = request.args.get('boxplot_folder', 0) 
  # # If true means consider only the channel values above zero
  # neglect_zero_pixels = request.args.get('neglect_zero', 0, type=bool)
  # print("is zero pixels neglected for boxplot:  ", neglect_zero_pixels)  

  boundaries_file_name = request.args.get('boundaries_file', 0)
  boundaries_folder = request.args.get('boundaries_folder', 0)    

  path_to_boundaries_file = os.path.join(boundaries_folder, boundaries_file_name)
  path_to_features_file = os.path.join(out_features_folder, features_file_name)
  path_to_markers_morph_file = os.path.join(out_features_folder, markers_morph_file_name)
  # path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)


  group_data_dic = json.loads(group_data_json_string)

  #tile_prop_list = { 'mean': '', 'max': '', 'std': ''}

  # if not (os.path.isfile(path_to_features_file.split(".json")[0] + '_markers_morphology.csv')): 

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
  # boxplot_data = []
  valid_tiles_counter = 0

  for marker in group_data_dic:

      # print(" Current channel to extract features : {}".format(marker["frameNum"]))
      print("channel Name: {}, channel number: {}".format(marker["frameName"], marker["frameNum"]))
      print("Wait reading {} channel..".format(marker["frameName"]))      

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


      if is_channel_normalize_required:
          n_channel = 1 if image.ndim == 2 else image.shape[-1]
          axis_norm = (0,1)   # normalize channels independently
          # axis_norm = (0,1,2) # normalize channels jointly
          # normalize the image
          image_norm = normalize(image, 1,99.8, axis=axis_norm)
          #scale image for the range 0 to 255
          sc = MinMaxScaler(feature_range=(0, 255))        
          image_norm_scaled = sc.fit_transform(image_norm).astype('uint8')        
          
          preprocess_image = image_norm_scaled
          
      else:
          preprocess_image = image



      # # Get boxplot data for each channel
      # if not (os.path.isfile(path_to_boxplot_file)): 
      #   df = pd.DataFrame(image.flatten(), columns=[marker["frameName"]])
      #   # Filter channel data for pixels > 0          
      #   if neglect_zero_pixels : 
      #     df_marker_positive = df.loc[df[marker["frameName"]] > 0]   
      #     stats = df_marker_positive.describe()   
      #   else:
      #     stats = df.describe()

      #   boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      

      # Get features for each SPX
      tile_points = [] 

      valid_tiles_counter = 0

      error_tiles_counter = 0

      for tile in tqdm(all_spx_boundaries):

            try:
                 tile_points = find_bbox(tile["spxBoundaries"])[0]

                 if (tile_points["top"] < 0) or (tile_points["left"] < 0):
                    print(' index with invalide coord  {}'.format(tile["label"]))
                    error_tiles_counter += 1
                    continue                 

                 imgTile = preprocess_image[tile_points["top"] : tile_points["top"] + tile_points["height"] , tile_points["left"]: tile_points["left"] + tile_points["width"] ];

                 # To create cell mask and crop each cell
                 spx_points = np.array([str_to_array(tile["spxBoundaries"])])
                 spx_points_shift = spx_points.copy()            
                 for pt in spx_points_shift[0]:
                    pt[0] = pt[0] - tile_points["left"]
                    pt[1] = pt[1] - tile_points["top"]    

                 mask = np.zeros(imgTile.shape[0:2], dtype=np.uint8) 
                 cv2.drawContours(mask, [spx_points_shift], -1, (255, 255, 255), -1, cv2.LINE_AA)
                 res = cv2.bitwise_and(imgTile,imgTile,mask = mask)

                 rect = cv2.boundingRect(spx_points_shift) # returns (x,y,w,h) of the rect
                 cropped_cell = res[rect[1]: rect[1] + rect[3], rect[0]: rect[0] + rect[2]] 


                 tile_mean = np.mean(cropped_cell, axis = (0, 1))
                 tile_nonzero_mean = cropped_cell[np.nonzero(cropped_cell)].mean()
                 tile_std = np.std(cropped_cell, axis = (0, 1))
                 tile_max = np.max(cropped_cell, axis = (0, 1))  
                 # tile_mean = np.mean(imgTile, axis = (0, 1));
                 # tile_std = np.std(imgTile, axis = (0, 1));
                 # tile_max = np.max(imgTile, axis = (0, 1));
            except ValueError:
            	 #raised if `y` is empty.
                 print(' index  {}'.format(tile["label"]))
                 error_tiles_counter += 1
                 continue

          # tile_features = {"id": tile["label"], "mean": tile_mean.tolist(), "max": tile_max.tolist(), "std": tile_std.tolist(), "OSDLayer": marker["OSDLayer"], "Frame": marker["frameName"]  }
                      
          # tile_entry = [tile_record for tile_record in allTilesFeatures if tile_record["id"] == tile["label"] ]
        
          # if tile_entry == []:
          #       allTilesFeatures.append({"id": tile["label"], "coordinates": [], "features": [tile_features] })               
          # else:
          #       tile_entry[0]["features"].append(tile_features) 

          # For nonzero mean, add:  'nonzero_mean': tile_nonzero_mean.tolist(),
          # The final return of id should start with spx-number e.g. spx-1, so we make it befor return as {"id": "spx-" + str(tile["label"]),  ..}
            tiles_split_channel_features.append({"id": tile["label"], "coordinates": tile_points, "features": {'Frame':  marker["frameName"],   'OSDLayer': marker["OSDLayer"],  'max': tile_max.tolist(),  'mean': tile_mean.tolist(), 'nonzero_mean': tile_nonzero_mean.tolist(),  'std': tile_std.tolist()} })               

          # curTileFeatures.push({ "OSDLayer": k, "mean": hist['mean'], "max": hist['max'], "std": hist['stdev'], "Frame": curGroup.Channels[k] }) 
          # allTilesFeatures.push({id: this.id , coordinates: this.attributes.points, features: curTileFeatures});
            valid_tiles_counter = valid_tiles_counter + 1

  print('Number of valid cells = {}'.format(valid_tiles_counter))
  print('Number of invalid cells = {}'.format(error_tiles_counter))
  # print( 'tiles_split_channel_features [{}] Data  = {}'.format(tiles_counter-1, tiles_split_channel_features[tiles_counter-1]))

  # Convert dic to dataframe to fast process big data
  df = pd.DataFrame.from_dict(tiles_split_channel_features)

  # Group rows of same tile id and aggregate features key 
  df_grouped_by_id = df.groupby(['id'])["features"].agg(lambda x: list(x) if len(x) > 1 else x.iloc[0]).reset_index()

  allTilesFeatures = df_grouped_by_id.to_dict('records')


  # Create a dataframe with different markers values mean, max, nonzero mean
  columnNames = ['id']
  for marker in allTilesFeatures[0]['features']:
      columnNames.append(marker["Frame"]+"_max")
      columnNames.append(marker["Frame"]+"_mean")
      columnNames.append(marker["Frame"]+"_nonzero_mean")
      columnNames.append(marker["Frame"]+"_std")

  df_cell_markers = pd.DataFrame(columns=columnNames)  

  # Fill the dataframe with values form dict
  print('Wait while converting features to dataframe...')
  for tile_features in  tqdm(allTilesFeatures):
      marker_features = {}
      marker_features['id'] = tile_features['id']
      for frame_features in tile_features['features']:
          marker_features[frame_features['Frame']+"_max"]= frame_features['max']
          marker_features[frame_features['Frame']+"_mean"]=frame_features['mean']
          marker_features[frame_features['Frame']+"_nonzero_mean"]=frame_features['nonzero_mean'] 
          marker_features[frame_features['Frame']+"_std"]=frame_features['std']        
      df_cell_markers = df_cell_markers.append(marker_features, ignore_index=True)   
      

  # convert column Cell id to data type int
  df_cell_markers['id'] = df_cell_markers['id'].astype(int)


  # fill any null with zero
  df_cell_markers = df_cell_markers.fillna(0)  

  # read cell morphology file having cells boundary, area, extent .. etc
  df_cell_morphology = pd.read_json(path_to_boundaries_file)  

  ##  Merge cell markers values(e.g. mean max std ..) and cell morphology values (e.g. cell area, eccenticity, ..)
  print('Merging dataframes in progress...')
  df_cell_markers_morphology = pd.merge(df_cell_markers, df_cell_morphology, how='left', left_on=['id'], right_on=['label'])

  # save dataframe to csv file
  print('Save dataframe to csv file...')
  if not (os.path.isdir(out_features_folder )):
     os.makedirs(out_features_folder)    
  df_cell_markers_morphology.to_csv(path_to_markers_morph_file, index=False) 
  #df_cell_markers_morphology.to_csv(path_to_features_file.split(".json")[0] + '_markers_morphology.csv', index=False) 

  # print('Save allTilesFeatures to basic json file...')
  # with open(path_to_features_file.split(".json")[0] + '_basic.json', 'w') as f:
	 #   json.dump(allTilesFeatures, f)

  # else:
	 #  print('Read markers morphology csv file...')  	
	 #  df_cell_markers_morphology = pd.read_csv(path_to_markers_morph_file)
	 #  df_cell_morphology = pd.read_json(path_to_boundaries_file) 
	 #  allTilesFeatures = pd.read_json(path_to_features_file.split(".json")[0] + '_basic.json')


  # Normalize marker mean values
  print('Normalizing markers in progress...')
  markers_norm_col = []
  for marker in allTilesFeatures[0]['features']:
      markers_norm_col.append(marker["Frame"]+"_norm")
      df_cell_markers_morphology[marker["Frame"]+"_norm"] = df_cell_markers_morphology[marker["Frame"] + cell_feature_to_normalize ].transform(lambda x: (x-x.mean())/x.std()).fillna(-1)#.reset_index()
  
  # scale marker normalized values to the range from 0-255
  sc = MinMaxScaler(feature_range=(0, 255))        
  df_cell_markers_morphology[markers_norm_col] = sc.fit_transform(df_cell_markers_morphology[markers_norm_col])


 


  print("Converting cells features dataframe to compatible histojs dictionary ..")
  dict_cell_markers_morphology = df_cell_markers_morphology.to_dict('records')
  allCellFeatures = []
  for marker in tqdm(group_data_dic):
      for tile in dict_cell_markers_morphology:
          allCellFeatures.append({"id": "spx-" + str(tile["id"]),
                                   'area': tile["area"],
                                   'eccentricity': tile["eccentricity"],
                                   'extent': tile["extent"],
                                   'label': tile["label"],
                                   'major_axis_length': tile["major_axis_length"],
                                   'minor_axis_length': tile["minor_axis_length"],
                                   'neighbors': tile["neighbors"],
                                   'orientation': tile["orientation"],
                                   'perimeter': tile["perimeter"],
                                   'solidity': tile["solidity"],  
                                   'x_cent': tile["x_cent"],
                                   'y_cent': tile["y_cent"],                                
                                   "features": {'Frame':  marker["frameName"],   'OSDLayer': marker["OSDLayer"],  'max': tile[marker["frameName"]+"_max"],  'mean': tile[marker["frameName"]+"_mean"], 'nonzero_mean': tile[marker["frameName"]+"_nonzero_mean"],  'std': tile[marker["frameName"]+"_std"], 'norm': tile[marker["frameName"]+"_norm"]  } })               


  df_allCellFeatures = pd.DataFrame.from_dict(allCellFeatures)
  df_allCellFeatures_grouped_by_label = df_allCellFeatures.groupby(['label'])["features"].agg(lambda x: list(x) if len(x) > 1 else x.iloc[0]).reset_index()
  df_allCellFeatures_update = pd.merge(df_allCellFeatures_grouped_by_label, df_cell_morphology, how='left', left_on=['label'], right_on=['label'])
  df_allCellFeatures_update['id'] = df_allCellFeatures_update['label'].apply(lambda x: "spx-" + str(x))
  # df_allCellFeatures_update.drop('type', axis=1)
  allTilesFeaturesWithMorphs = df_allCellFeatures_update.to_dict('records')

  print("-------------------------------------------------------------------------------------------------")
  print(allTilesFeaturesWithMorphs[0])
  print("-------------------------------------------------------------------------------------------------")





  # correlation and heatmap
  # print('Create and save correlation heatmap...')
  # correlation =  df_cell_markers_morphology.loc[:, df_cell_markers_morphology.columns.difference(['id', 'label', 'type', 'spxBoundaries', 'neighbors'])].corr()
  # fig = plt.figure(figsize = (8,8))
  # sns.heatmap(correlation, cbar=True, square=True, fmt='.1f',annot=True, annot_kws={'size':8}, cmap='Blues')
  # fig.savefig(path_to_features_file.split(".json")[0] + '_feat_correlation.png', dpi=600,  bbox_inches='tight', pad_inches=0.01)


  # Create features JSON file 
  # if not (os.path.isfile(path_to_boxplot_file)): 
  # if not (os.path.isdir(out_features_folder )):
  #     os.makedirs(out_features_folder)     
  # with open(path_to_features_file, 'w') as f:
  #     json.dump(allTilesFeaturesWithMorphs, f)    

  # with open(path_to_features_file, 'w') as f:
  #   json.dump(allTilesFeaturesWithMorphs, f) 

  return Response(json.dumps(allTilesFeaturesWithMorphs))   


@app.route('/createAllGridTilesFeature')
def createAllGridTilesFeature():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  grid_size = request.args.get('gridSize', 0, type=int)

  group_data_json_string = request.args.get('grp_data', 0)

  features_file_name = request.args.get('features_file', 0)
  out_features_folder = request.args.get('features_folder', 0)   

  # boxplot_file_name = request.args.get('boxplot_file', 0)
  # out_boxplot_folder = request.args.get('boxplot_folder', 0)   
  # If true means consider only the channel values above zero
  neglect_zero_pixels = request.args.get('neglect_zero', 0, type=bool)
  print("is zero pixels neglected for boxplot:  ", neglect_zero_pixels)  

  path_to_features_file = os.path.join(out_features_folder, features_file_name)
  # path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)

  group_data_dic = json.loads(group_data_json_string)

  #tile_prop_list = { 'mean': '', 'max': '', 'std': ''}

  print("Please wait while creating features for grids ................")

  if( api_key ):
    gc = girder_client.GirderClient(apiUrl = base_url)
    gc.authenticate(apiKey = api_key)  



  allTilesFeatures = []
  tiles_split_channel_features = []
  # boxplot_data = []
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
            # return jsonify("Not a valide gray channel");      

      # # Get boxplot data for each channel
      # if not (os.path.isfile(path_to_boxplot_file)): 
      #   df = pd.DataFrame(image.flatten(), columns=[marker["frameName"]])
      #   # Filter channel data for pixels > 0           
      #   if neglect_zero_pixels : 
      #     df_marker_positive = df.loc[df[marker["frameName"]] > 0]   
      #     stats = df_marker_positive.describe()   
      #   else:
      #     stats = df.describe()

      #   boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      

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
  # print( 'tiles_split_channel_features [{}] Data  = {}'.format(tiles_counter-1, tiles_split_channel_features[tiles_counter-1]))

  # Convert dic to dataframe to fast process big data
  df = pd.DataFrame.from_dict(tiles_split_channel_features)

  # group rows of same tile id and aggregate features key 
  df_grouped_by_id = df.groupby(['id','coordinates'])["features"].agg(lambda x: list(x) if len(x) > 1 else x.iloc[0]).reset_index()

  allTilesFeatures = df_grouped_by_id.to_dict('records')

  # if not (os.path.isfile(path_to_boxplot_file)): 
  #     if not (os.path.isdir(out_boxplot_folder )):
  #         os.makedirs(out_boxplot_folder)     
  #     with open(path_to_boxplot_file, 'w') as f:
  #         json.dump(boxplot_data, f)  

  return Response(json.dumps(allTilesFeatures)) 


#  calculate channel mean, max, min, std, median, q1, q3 
@app.route('/createChannelsStatisticalData')
def createChannelsStatisticalData():

  base_url = request.args.get('baseUrl', 0)
  item_id = request.args.get('itemId', 0)
  api_key = request.args.get('apiKey', 0)

  is_channel_normalize_required = request.args.get('isChannelNormalizeRequired', 0, type=bool)

  group_data_json_string = request.args.get('grp_data', 0)

  boxplot_file_name = request.args.get('boxplot_file', 0)
  out_boxplot_folder = request.args.get('boxplot_folder', 0)   
  # If true means consider only the channel values above zero
  neglect_zero_pixels = request.args.get('neglect_zero', 0, type=bool)
  print("is zero pixels neglected for boxplot:  ", neglect_zero_pixels)

  path_to_boxplot_file = os.path.join(out_boxplot_folder, boxplot_file_name)

  group_data_dic = json.loads(group_data_json_string)

  #tile_prop_list = { 'mean': '', 'max': '', 'std': ''}

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

      # image_width, image_height = image_raw.size 
      
      if not is_grey_scale(image):
        print("channel is not a valide gray scale image, converting  it to gray in progress... ")

        try:            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        except ValueError:  #raised if `y` is empty.
            print(' error converting channel to gray  {}'.format(ValueError))
            return jsonify("Failed");    
            # return jsonify("Not a valide gray channel");     


      if is_channel_normalize_required:
          n_channel = 1 if image.ndim == 2 else image.shape[-1]
          axis_norm = (0,1)   # normalize channels independently
          # axis_norm = (0,1,2) # normalize channels jointly
          # normalize the image
          image_norm = normalize(image, 1,99.8, axis=axis_norm)
          #scale image for the range 0 to 255
          sc = MinMaxScaler(feature_range=(0, 255))        
          image_norm_scaled = sc.fit_transform(image_norm).astype('uint8')        
          
          preprocess_image = image_norm_scaled
          
      else:
          preprocess_image = image



      # Get boxplot data for each channel
      image_flatten = preprocess_image.flatten()
      image_flatten_nonzero = image_flatten.ravel()[np.flatnonzero(image_flatten)]      

      # df_marker_positive = pd.DataFrame(image_flatten_nonzero, columns=[marker["frameName"]])

      if neglect_zero_pixels : 
        # df_marker_positive = df.loc[df[marker["frameName"]] > 0]
        # stats = df_marker_positive.describe()   
        stats = pd.DataFrame(image_flatten_nonzero, columns=[marker["frameName"]]).describe()
      # Filter channel data for pixels > 0   
      else:
        # stats = df.describe()
        stats = pd.DataFrame(image_flatten, columns=[marker["frameName"]]).describe()

      boxplot_data.append({'Frame':  marker["frameName"], 'channelNum': marker["frameNum"],  'OSDLayer': marker["OSDLayer"],  'max': stats[marker["frameName"]]['max'],  'mean': stats[marker["frameName"]]['mean'],  'std': stats[marker["frameName"]]['std'], 'min': stats[marker["frameName"]]['min'], 'q1': stats[marker["frameName"]]['25%'], 'median': stats[marker["frameName"]]['50%'], 'q3': stats[marker["frameName"]]['75%'] })      


  if not (os.path.isdir(out_boxplot_folder )):
      os.makedirs(out_boxplot_folder) 
  with open(path_to_boxplot_file, 'w') as f:
      json.dump(boxplot_data, f)  

  # if not (os.path.isfile(path_to_boxplot_file)): 
  #   return "Failed"

  return Response(json.dumps(boxplot_data)) 
      
# @app.route('/TEST')
# def TEST():
#   return jsonify("notExist"); 


# @app.route('/readFeatures')
# def readFeatures():
#   file_name = request.args.get('filename', 0)
#   out_folder = request.args.get('outfolder', 0)
#   path_to_file = os.path.join(out_folder, file_name)

#   print("Please wait while reading Features file .....", path_to_file)

#   if (os.path.isfile(path_to_file)):  
#     file = open(out_folder + file_name, "r")  
#     features = file.read()
#     file.close()
#     return features
#   else:
#     return "notExist"
   


@app.route('/checkFile')
def checkFile():
 file_name = request.args.get('filename', 0)
 out_folder = request.args.get('outfolder', 0)
 path_to_file = os.path.join(out_folder, file_name)

 if (os.path.isfile(path_to_file)):  
  return "true"
 else:
  return "false"

@app.route('/removeFile')
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
   


@app.route('/saveFeatures')
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

@app.route('/downloadFile')
def downloadFile():
  base_url = request.args.get('baseUrl', 0)
  request_url = request.args.get('requestUrl', 0)
  out_folder = request.args.get('outfolder', 0)
  file_name = request.args.get('filename', 0)
  api_key = request.args.get('apiKey', 0)

  gc = girder_client.GirderClient(apiUrl = base_url)

  if( api_key ):
      gc.authenticate(apiKey = api_key)

  # if(authentication):   
  #    gc.authenticate(username = dsa_user, password = user_password)
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

@app.route('/readRemoteCsvFile')
def readRemoteCsvFile():
  base_url = request.args.get('baseUrl', 0)
  request_url = request.args.get('requestUrl', 0)
  api_key = request.args.get('apiKey', 0)

  gc = girder_client.GirderClient(apiUrl = base_url)

  if( api_key ):
      gc.authenticate(apiKey = api_key)

  csv_file = gc.get( request_url, jsonResp = False)
  # CSV Read
  raw_data = StringIO(csv_file.content)
  df = pd.read_csv(raw_data)
  # Convert to JSON
  to_json = df.to_json(orient="records")
  json_data = json.loads(to_json)

  return Response(json.dumps(json_data))


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







