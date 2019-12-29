import * as express from "express";

class SubRouter {
    router: express.Router;
    constructor() {
        // Define a top level router
        const subRouter = express.Router();

        // Define how this router will handle different routes
        // In a complicated router, this could be separated into multiple methods of SubRouter
        subRouter.get('/r/:id', function (req, res, next) {
            // Each call to subRouter.get identifies a handler for GET requests to a particular route
            // If I add multiple handlers to the same route, express will deal with each in a stack
            // Also, individual subRouter.get has a substack of functions that are called in order
            if (req.params.id == '641')
                next('route'); // next route skips all middleware calls and skips to the next route handler
            else {
                console.log("This the first middleware call in the first handler for /r/:id");
                next(); // move on to next middleware call
            }
        }, function (req, res, next) {
            console.log("This is the second middleware call in the first handler for /r/:id. It will cancel other route handlers");
            res.json({ "response": `ID is ${req.params.id}, not 641` }); // this cancels other route handlers and ends res req cycle
        });
        subRouter.get('/r/:id', function (req, res, next) {
            console.log("This is the first middleware call in the second handler for /r/:id. It is only accessible when id=641");
            res.json({ "response": "ID is the special one, 641." });
        });
        
        this.router = subRouter; 
    }
}

// In most languages, an import statement simply adds a bunch of classes to outermost scope. In ts/js, 
//     importing a module adds a new instance variable whose fields correspond to the exported objects of the module.
// "export default" lets me specify a default object to export. For example, in java.lang,
//     I might "export default String" and then I could "import x from java.lang" and 
//     x would automatically resolve to the default, java.lang.String.
// The whole point of this file is to construct an instance of express.Router which will then be added as a top
//      level route in our express app instance. When we import this file, all code outside any class/method is run
//      and the import statement returns the export default
export default new SubRouter().router; 