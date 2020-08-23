const productRoute = (app, fs) => {
  // variables
  const dataPath = "./data/productData.json";

  const readFile = (callback,returnJson = false,filePath = dataPath,encoding = "utf8") => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // READ
  app.get("/productservice", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });

  // READ by productId
  app.get("/productservice/:productId", (req, res) => {
    readFile((data) => {
      const productId = req.params["productId"];
      let responseData = {};
      data.map(eachRecord => {
        if(eachRecord.productId === productId){
          responseData = eachRecord;
        }
    });
      res.status(200).send(responseData);
    }, true);
  });

  // CREATE
app.post("/productservice", (req, res) => {
  readFile((data) => {
    data.push(req.body);
    writeFile(JSON.stringify(data), () => {
      res.status(200).send("new product added");
    });
  }, true);
});

// UPDATE
app.put("/productservice", (req, res) => {
  readFile((data) => {
    let productId="";
    data.map( eachRecord => {
      if(eachRecord.productId === req.body.productId){
        productId = eachRecord.productId;
        eachRecord.productName = req.body.productName;
        eachRecord.productCode = req.body.productCode;
        eachRecord.releaseDate = req.body.releaseDate;
        eachRecord.description = req.body.description;
        eachRecord.price = req.body.price;
        eachRecord.starRating = req.body.starRating;
        eachRecord.imageUrl = req.body.imageUrl;
      }
    });

    writeFile(JSON.stringify(data), () => {
      res.status(200).send(`product id:${productId} updated`);
    });
  }, true);
});

// DELETE
app.delete("/productservice/:productId", (req, res) => {
  console.log("delete called",req.params["productId"])
  readFile((data) => {
    // add the new product
    const productId = req.params["productId"];
    console.log("before======>",data);
    data.map( (eachRecord, index) => {
      if(eachRecord.productId === productId){
        console.log("inside if======>",eachRecord);
        data.splice(index,1);
      }

    })
    console.log("after======>",data);
    writeFile(JSON.stringify(data), () => {
      res.status(200).send(`product id:${productId} removed`);
    });
  }, true);
});

};



module.exports = productRoute;
