## HistoJS [![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)]()

<div align="center">
  
[![HistoJS logo](https://lh3.googleusercontent.com/Q3eYJfpQMety3sUUTLKeZKLkJBzx-NmLZNn1NphdWs9hBNYmfHCzZTphddpXDcfUxjtaHTXTr89R57LieZflqUsGHM3TxtIbVNoQOKf3ZbPjB01C8gYANmezAzq4JgUU=w1823)]()

 [![Github contributors](https://img.shields.io/badge/contributors-*-brightgreen)](https://github.com/Mmasoud1/HistoJS/graphs/contributors) [![licence ](https://img.shields.io/badge/license-BY--NC--ND-orange)](https://creativecommons.org/licenses/by-nc-nd/3.0/) [![Python ](https://img.shields.io/badge/python-3.5%20%7C%203.6%20%7C%203.7-blue)]()[![JS ](https://img.shields.io/badge/Types-JavaScript-blue)]()
[![HW ](https://img.shields.io/badge/HardWare-GPU-green)]()


</div>




HistoJS is an interactive tool to manage, manipulate, store and analysis the multi-channels OME-Tiff files .

The tool is using Digital Slide Archive as a backbone to update the image metadata remotely or locally.

- Install requirements
    ```bash
    3.4< python <3.8  is recommended
    ```

    ```bash
    conda env create -f histojs.yml
    ```


To run locally, just start up a simple local server from the root level of the repository with the available port number 8xxx (e.g. 8010)

`python -m http.server 8xxx`


Also, from the root level of the repository open a new terminal and run the python Api:

    `
    conda activate histojs
    python RestApi.py
    `

-In the browser url type: 
       
      
     `http://localhost:8020/`

A dockerized version will be released soon for the api. 

For using the backbone DSA server, you need to create a user account on any DSA servers and upload your OME image, cells mask, and channels metadata CSV file to your collection as in this link:

`https://styx.neurology.emory.edu/girder/#folder/5e361c5c34679044bda81b11`

Please note: if the name of the OME image file is $fileName$.ome.tif (e.g. TONSIL-1_40X.ome.tif), the cell mask must be $fileName$_cellMask.tiff (e.g. TONSIL-1_40X_cellMask.tiff), and the Channel metadata CSV file should be $fileName$_channel_metadata.csv (e.g. TONSIL-1_40X_channel_metadata.csv)

The Channel metadata CSV file must have at least two columns: 'channel_number' and 'channel_name'



## Offline Demo
Demo H/W configuration: Processor - Intel® Core™ i7-8700 CPU @ 3.20GHz × 12, RAM - 16GB, GPU - GeForce GTX 1050

### Design Mode

For creating OME channel groups, browse to your server file and click design mode with the tool.

![App Interface](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/showMe.gif)


<div align="center">

[![Google Doc](https://img.shields.io/badge/HistoJS-Feedback-blue)](https://docs.google.com/forms/d/e/1FAIpQLSdHuO--mG00sKydQpJ7sPpDmhcJ4ECdj-wAB1kwXQExh_nUSg/viewform?usp=sf_link) [![CC BY-NC-ND ](https://img.shields.io/badge/license-BY--NC--ND-orange)](https://creativecommons.org/licenses/by-nc-nd/3.0/) 

**Copyright 2021 Mohamed Masoud**
</div>
