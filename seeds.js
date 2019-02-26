var mongoose = require("mongoose"),
Campground   =  require("./models/campground"),
Comment      =  require("./models/comment");


var data = [
    {
        name: "Azul",
        image: "https://farm4.staticflickr.com/3450/3191705947_02398846cc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Natalio Ruiz",
        image: "https://farm4.staticflickr.com/3450/3191705947_02398846cc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Puños",
        image: "https://farm4.staticflickr.com/3450/3191705947_02398846cc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Arbolito",
        image: "https://farm4.staticflickr.com/3450/3191705947_02398846cc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    
]

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        // if(err){
        //     console.log(err);
        // }
    //     console.log("removed campgrounds!");
    //     // add a few a campgrounds
    //     data.forEach(function(seed){
    //     Campground.create(seed, function(err, data){
    //         if(err){
    //             console.log(err)
    //         }else{
    //             console.log("added a campground");
    //             //create a comment
    //             Comment.create({
    //                 text: "This route is great, but I wish it's more protected.",
    //                 author: "Homer"
    //         }, function(err, comment){
    //             if(err){
    //                 console.log(err);
    //             }else{
    //                 data.comments.push(comment);
    //                 data.save();
    //                 console.log("created new comment");
    //             } 
    //         });
    //         }
    //     });
    // });
    });
}

module.exports = seedDB;