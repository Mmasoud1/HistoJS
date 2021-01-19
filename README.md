# HistJS v1.0.0
Copyright 2020 Mohamed Masoud


An interactive tool to manage, manipulate, store and analysis the multi-channels OME-Tiff files .

The tool is using Digital Slide Archive as a backbone to update the image metadata remotely or locally.

To run locally, just start up a simple local server from the root level of the repository with available port number 8xxx (e.g. 8010)

`http://localhost:8010/`

Also, the python Api file needs to run from terminal:

`python RestApi.py`

A dockerized version will release soon for the api. 

For DSA server, you need to create your account on any DSA servers and upload your OME image, cells mask, and channels metadata CSV file as in this link:

`https://styx.neurology.emory.edu/girder/#folder/5e361c5c34679044bda81b11`

Please note: if the name of the OME image file is $fileName$.ome.tif (e.g. TONSIL-1_40X.ome.tif), the cell mask must be $fileName$_cellMask.tiff (e.g. TONSIL-1_40X_cellMask.tiff), and the Channel metadata CSV file should be $fileName$_channel_metadata.csv (e.g. TONSIL-1_40X_channel_metadata.csv)

The Channel metadata CSV file must have at least two columns: 'channel_number' and 'channel_name'

For creating OME channel groups, browse to your server file and click design mode with the tool as in Demo section below.

For citation:

`https://github.com/Mmasoud1/HistoJS`

## License.
[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/3.0/) license


## Demo

![App Interface](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/showMe.gif)
