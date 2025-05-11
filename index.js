import express from 'express';

const app = express();

app.listen(5200, () => {
    console.log('App listening at port 8000');
});


app.get("/spotify", async (req, res) => {
    res.json({
        "data": "this is test data"
    })
});

