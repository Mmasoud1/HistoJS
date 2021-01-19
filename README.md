# HistJS v1.0.0
Copyright 2020 Mohamed Masoud


An interactive tool to manage, manipulate, store and analysis the multi-channels OME-Tiff files .

For citation please mention the link:

`https://gitlab.com/mmasoud1/histojs-v1.0.0`

The tool is using Digital Slide Archive as a backbone to update the image metadata remotely or locally.

To run locally, just start up a simple local server from the root level of the repository with available port number 8xxx (e.g. 8010)

`http://localhost:8010/`

Also, the python Api file needs to run from terminal:

`python RestApi.py`

A dockerized version will release soon for the api. 

For DSA server, you need to create your account on any DSA servers and upload your OME file and basic omeDescription metadata as in this link:

`https://styx.neurology.emory.edu/girder/#item/5e361da534679044bda81b16`

For creating OME channel groups, browse to your server file and click design mode with the tool as in show me section below.

## License.
[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/3.0/) license


## Demo

![App Interface](https://github.com/Mmasoud1/HistoJS/blob/main/Demo/showMe.gif)
