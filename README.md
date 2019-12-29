# Husky Hunt App

This is a boilerplate for the Husky Hunt App API. Please see [this](https://mherman.org/blog/developing-a-restful-api-with-node-and-typescript/) guide, which I used to create the infrastructure.

## Logistics

**API Team**: 
- *Co-lead* Matt
- *Co-lead* Dan
- Ben

**Web Team**:
- *Co-lead* Max
- Ryan
- Olivia

**Team which decides the features**:
- Shurobhi
- Owen
- everyone else


# Creating Routes

At a high level, a REST API is organized into routes. Each route provides a logically grouped subset of the API functionality. For example, `www.api.com/map/...` might represent the `map` route, and provide all functionality related to adding or retrieving map information. 

In the code, the implementations for different routes are similarly partitioned. In `controllers`, there is a file for each high level route, and these files are imported in `controllers/main.ts` and then added as routes in the express app instance.