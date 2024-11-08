/* import modules */
import express from "express";
import pg from "pg";
import axios from "axios";

/* declare const */
const app = express();
const port = 3000;
const API_URL = "https://www.googleapis.com/books/v1/volumes/";


/* setting the database */
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "Pg123@Db",
    port : "5432"
});


/* starting the database */
db.connect()
.then(() => console.log("Starting DB connection"))
.catch((err)=> console.error("error starting the db: ", err));
/* public folder for static files */
app.use(express.static("public"));

/* middlware */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* declaring function */

async function  getDetails(id){
    try{
        const response = await axios.get(API_URL + id);
        const result = response.data.volumeInfo;
        let details = {
            title: result.title || "unavailable",
            subtitle: result.subtitle || "unavailable",
            author: result.authors || "unavailable",
            description: result.description || "unavailable",
        };
    
        return details
    }catch(err){
        console.log(err);
    }
}

/* home page load */
app.get("/", async (req,res)=>{
    const libraryDB = await db.query("select * from books");
    res.render("index.ejs", {books : libraryDB.rows});
});

/* when click on a book */
app.post("/details", async (req,res)=>{
    const id = req.body.google_id;
    const details = await getDetails(id);
    
    res.render("details.ejs", {detail: details});
})


/* starting the server*/
app.listen(port,() =>{
    console.log(`We're running on ${port}`);
})