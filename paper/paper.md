---
title: 'HistoJS: Web-Based Analytical Tool for Advancing Multiplexed Images'
tags:
    - Visualization
    - Web Machine Learning
    - Multiplexed Images
    - Spatial Biology
    - Single Cell
authors:
    - name: Mohamed Masoud^[corresponding author]
      orcid: 0000-0002-5365-242X
      affiliation: 1
    - name: David Gutman
      orcid: 0000-0002-1386-8701
      affiliation: 3      
    - name: Sergey Plis
      orcid: 0000-0003-0040-0365
      affiliation: "1, 2"
affiliations:
  - name: Tri-institutional Center for Translational Research in Neuroimaging and Data Science (TReNDS), Georgia State University, Georgia Institute of Technology, Emory University, Atlanta, United States of America
    index: 1
  - name: Department of Computer Science, Georgia State University, Atlanta, United States of America
    index: 2
  - name: Department of Pathology, Emory University School of Medicine, Atlanta, United States of America
    index: 3    
date: 25 December 2023
bibliography: paper.bib
---

# Summary

Advances in multiplexed imaging technologies enable us to capture spatial single-cell proteomics and transcriptomics data in unprecedented detail and with high spatial resolution. This large volume of image data presents a challenge in accurately isolating and quantifying distinct cell types to understand disease complexity, neurological disorders, potential biomarkers, and targets for drug development. Therefore, there is an incremental demand and challenges to developing and validating cutting-edge quantitative image analysis tools for diagnosis, prognosis, and therapy response prediction and assessment in neurological and oncological diseases. [HistoJS](https://github.com/Mmasoud1/HistoJS) is a newly developed web-based tool that aims to overcome the challenges of utilizing highly-multiplexed immunofluorescence (mIF) images [@lin2015highly] for spatial biology research. It provides open-source and extensible tool for analyzing spatial-molecular patterns, enabling a deeper view of the single-cell spatial relationship, along with machine learning algorithms in an easy-to-use interactive interface for the biomedical community. 



# Statement of need

Single-cell data have the potential to enhance our understanding of biological systems, shedding light on disease mechanisms and reactions. The data from single-cell sequencing and multiplexed imaging technologies have distinctive capabilities for cell phenotyping, clustering, and landscape analysis.
However, handling large-scale multiplexed image datasets generated from advanced imaging technologies and narrowing the lag between those technologies and the existing analytical tools remains challenging. There is a need to effectively utilize subcellular imaging data by storing, retrieving, visualizing, and performing quantitative analysis of those big data. Addressing the challenges posed by highly multiplexed image analysis, HistoJS emerges as an open-source and adaptable tool for visualizing and analyzing intricate biological processes with spatial subcellular resolution. It offers a graphical user interface for effortless navigation through stored multiplexed images, allowing dynamic selection of image channels for composite views. HistoJS encompasses a diverse set of image processing and machine learning algorithms to support essential analysis, including real-time cell segmentation, phenotyping, classification, correlations, spatial analysis, and quantification of cell types to unveil interactions within the tissue samples. These functionalities are provided in an easy-to-use interactive interface to help biomedical users and related groups understand the progression of neurological and oncological diseases and find clinical outcomes. Other commercial tools like the VisioPharm suite are expensive and complicated to be customized by the informatics community to meet the specific needs of cancer researchers. QuPath [@bankhead2017qupath], another popular open-source tool, has some useful features for the analysis that are not web-based and need more key features for whole slide image analysis. Positioned as a web-based solution, HistoJS focuses on enhancing usability, accessibility, sustainability, scalability,  and collaboration. Boosting user-friendly interfaces and cross-platform compatibility, HistoJS ensures a seamless and accessible experience. The sustainability of HistoJS is realized through centralized updates and reduced hardware dependencies, streamlining management and minimizing hardware requirements.





# Background

Advanced High-plex imaging technologies, such as Multiplexed Immunofluorescence (MxIF) [@gerdes2013highly], tissue-based cyclic immunofluorescence (t-CyCIF) [@lin2018highly], CO-Detection by indEXing (CODEX) [@goltsev2018deep], and Multiplexed Ion Beam Imaging (MIBI) [@angelo2014multiplexed], facilitate the study of intricate biological processes with precise spatial subcellular resolution. While MIBI utilizes a mass spectrometry-based approach, the other technologies utilize conventional fluorescence microscopes, and all enable the simultaneous detection of 50+ antigens within a single tissue section. These technologies offer invaluable insights into the complexities of biological systems. The process typically commences with sample preparation of high-quality formaldehyde-fixed and paraffin-embedded (FFPE)  tissue sections (e.g., biopsy, surgical specimen) that can pass through either an iterative, multicycle image acquisition pipeline as CODEX or a non-iterative single imaging cycle, such as MIBI. Either approach produces a stack of raw microscopy image tiles that need stitching with drift correction and then registration across channels to generate large-scale mosaic images in OME-TIFF (open microscopy environment-tagged image file format). Each channel represents the spectral signal from a specific marker or antigen in the tissue. Other preprocessing steps include image deconvolution to minimize image blurring,  noise reduction to reduce background and autofluorescence noise, and artifact removal that addresses image artifacts (e.g., axial and lateral tile drift). Preprocessing steps are essential to enhance the quality of the raw data and prepare it for downstream analysis. The goal is to identify, localize, and count different cell types to study their population and interactions.


# Pipeline

For hosting and organizing user data, the Digital Slide Archive (DSA), an open-source platform, is used as a data hosting environment [@gutman2017digital]. DSA is a reliable containerized web-based platform that can store and manage large image datasets such as immunofluorescence image data. DSA components include a MongoDB database, a job execution/scheduler (girder worker), and a Secure data management system (Girder) that provides RESTful APIs to allow programmatic control over image data and metadata while providing user access controls. DSA is easy to install locally on the user side or remotely on the cloud. HistoJS uses DSA as a backend to manage user images locally or remotely and store analysis results according to end-user preferences. To visualize mIF images in HistoJS, OpenSeadragon [@OpenSeadragon], an open-source web-based viewer, is used. HistoJS has rich JavaScript functions to support different types of canvas rendering global Composite operations, giving the best insight into data with panning, zooming, and overlay options. To that end, we were able to make HistoJS suitable for building a customized stack of protein channels and composite them in a high resolution and full scale as illustrated in \autoref{fig:HistoJS-Overview}. The analytical components of HistoJS include cell segmentation, phenotyping, classification, correlations, spatial analysis, and quantification of cell types to discover cell interactions. We tackled the challenges in real time; fast and reliable techniques are used to expedite the extraction of cell boundaries [@schmidt2018cell] and morphological features (e.g., solidity, eccentricity, orientation, etc.). Cell neighbor detections are tackled with spatial plotting and analysis by computing Delaunay neighborhood graphs [@gabriel1969new].  


![HistoJS graphical interface overview. Biological statistical tasks such as biological cell biomarkers histogram, sample statistics quartiles, cell classification, correlations, spatial analysis, and quantification of specific marker expression are available for cell analysis and discovering the cell interactions. (Dataset [@DataSet-1]).\label{fig:HistoJS-Overview}](Overview_New.png)


Although the tool is suitable for cluster-based deployment, it can also be deployed on the cloud or locally on the client side. With an average GPU GeForce GTX 1050 Ti of 768 cores/ 4GB buffer, 7Gbps memory speed, Intel® Core™ i7-8700 CPU @ 3.20GHz × 12, and a system memory of 16 GB, HistoJS shows in general fast response while rendering and processing immunofluorescence images, with the potential for better performance thanks to the TensorFlow.js[@tensorflow-js] Web Graphics Library ( WebGL-2) backbone.  

# Code availability


HistoJS source code is publicly accessible in the GitHub repository  ([https://github.com/Mmasoud1/HistoJS](https://github.com/Mmasoud1/HistoJS)). Multiple DSA online servers can be accessed from HistoJS such as [https://styx.neurology.emory.edu/girder/](https://styx.neurology.emory.edu/girder/#) to load mIF data samples and test the tool performance. Researchers could visualize and analyze the expression patterns of key biomarkers associated with diseases and disorders. The platform's interactive features facilitated the identification of disease-specific signatures, providing valuable insights into the molecular basis of diseases.

Detailed step-by-step [documentation](https://github.com/Mmasoud1/HistoJS/wiki) is provided along with HistoJS [live demo](https://Mmasoud1.github.io/HistoJS/).  


# Author contributions

We describe contributions to this paper using the CRediT taxonomy [@credit].
Writing – Original Draft: M.M.; 
Writing – Review & Editing: M.M., and S.P.;
Conceptualization and methodology: M.M., and D.G.;
Software and data curation: M.M.;
Validation: M.M., and S.P.;
Resources: D.G.;
Visualization: M.M.;
Project Administration: M.M.


# References


