# Neighborhood Map

Udacity Full-stack Nanodegree 5th project


## Getting Started

Clone the Repository.


### Dependencies

Neighborhood Map depends on:
```
- jQuery v2.2
- KnockoutJS v3
- Bootstrap 3
- adminLTE v2.3 [UI]
- Google Map API v3
- Foursquare API v2
```

### Run

Due to browser-security [works on mozilla firefox 53.0 (64-bit) though] the app cannot fetch a local json file , so you will run an http server to serve app files.

At the root directory of the app files , run the following depending on your python version :

Python 3:
```
python -m http.server 8080
```
Python 2:
```
python -m SimpleHTTPServer 8080
```
Then to run the app you can visit http://localhost:8080/ 

### Test

If needed to change the neighborhood to any other location,
just reconfigure lat-lng as follows:


1- at app.js :
```
ll: '29.9626961,31.2769423'

```

2- at map.js :
```
var centerPos = {lat: 29.9626961, lng: 31.2769423};

```

## Authors

* **Mostafa Azeem** - *Initial work* - [Ischizoid](https://github.com/ischizoid/)
