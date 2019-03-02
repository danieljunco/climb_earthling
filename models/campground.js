var mongoose     =       require("mongoose");
var Comment      =       require("./comment");

var climbgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    level: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

climbgroundSchema.pre("remove", async function(next){
    try{
        await Comment.remove({
            "_id": {
                $in: this.comments
            }
        });
        next();
    } catch(err){
        console.log(err);
    }
});

module.exports = mongoose.model("Campground", climbgroundSchema);