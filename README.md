## HistoJS [![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)]()

<div align="center">

[![HistoJS logo](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/histoJS.png)]()

 [![Github contributors](https://img.shields.io/badge/contributors-*-brightgreen)](https://github.com/Mmasoud1/HistoJS/graphs/contributors) [![licence ](https://img.shields.io/badge/license-BY--NC--ND-orange)](https://creativecommons.org/licenses/by-nc-nd/3.0/) [![Python ](https://img.shields.io/badge/python-3.5%20%7C%203.6%20%7C%203.7-blue)]()[![JS ](https://img.shields.io/badge/Types-JavaScript-blue)]()
[![HW ](https://img.shields.io/badge/HardWare-GPU-green)]()


</div>



HistoJS is an interactive tool to manage, manipulate, store and analysis the multi-channels OME-Tiff files .

The tool is using [Digital Slide Archive (DSA)](https://styx.neurology.emory.edu/girder/#) as a backbone to host OME files and update the image metadata remotely or locally. 

- Install requirements
```bash
    3.4 < python < 3.8  is recommended
```

```bash
    conda env create -f histojs.yml
```




After creating the histojs environment, from the root level of the repository open a new terminal, activate the env and run the python ResApi file:

```bash
    source activate histojs
    python RestApi.py
```
A dockerized version for the RestApi will be released soon. 

To run the localhost in the browser, just start up a simple local server from the root level of the repository with any available port number 8xxx (e.g. 8020)

```bash
    python -m http.server 8xxx
```


-In the browser url type: 

```bash
    http://localhost:8020/
```       
      
  

## Dataset

OME-Tiff  and their channels metadata CSV files must be hosted on a DSA server. To host your dataset you need to create a user account on any DSA servers such as [Styx](https://styx.neurology.emory.edu/girder/#) and upload your OME image, cells mask(optional), and channels metadata CSV file to your collection as in this [example](https://styx.neurology.emory.edu/girder/#folder/5e361c5c34679044bda81b11):

```bash
    https://styx.neurology.emory.edu/girder/#folder/5e361c5c34679044bda81b11
``` 

If you need to install DSA server locally on you machine and host your data locally please follow this [link](https://github.com/DigitalSlideArchive/digital_slide_archive/tree/master/ansible).


### File naming conventions: 

```bash
- The OME image file must be $fileName$.ome.tif (e.g. TONSIL-1_40X.ome.tif).
- The cell mask if available must be $fileName$_cellMask.tiff (e.g. TONSIL-1_40X_cellMask.tiff).
- The Channel metadata CSV file should be $fileName$_channel_metadata.csv (e.g. TONSIL-1_40X_channel_metadata.csv).
- The Channel metadata CSV file must have at least two columns: 'channel_number' and 'channel_name'.
```



## Offline Demo
Demo H/W configuration: Processor - Intel® Core™ i7-8700 CPU @ 3.20GHz × 12, RAM - 16GB, GPU - GeForce GTX 1050

### Design Mode

For creating OME channel groups, browse to your server file and click design mode with the tool.

![App Interface](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/DesignMode.gif)


### Analysis Mode

![App Interface](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/AnalysisMode.gif)

<div align="center">

[![Google Doc](https://img.shields.io/badge/HistoJS-Feedback-blue)](https://docs.google.com/forms/d/e/1FAIpQLSdHuO--mG00sKydQpJ7sPpDmhcJ4ECdj-wAB1kwXQExh_nUSg/viewform?usp=sf_link)[![CC BY-NC-ND ](https://img.shields.io/badge/license-BY--NC--ND-orange)](https://creativecommons.org/licenses/by-nc-nd/3.0/) 

**Copyright 2021 Mohamed Masoud**
</div>

