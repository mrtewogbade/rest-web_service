module.exports =  (req, res, next) => {
      const pageAsNumber = Number.parseInt(req.query.page)
    const sizeAsNumber = Number.parseInt(req.query.size)


    let page = 0;

    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
        page = pageAsNumber;
    } 

    let size = 10;
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
        size = sizeAsNumber;

    }

    req.pagination = {
        page, size
    }
    next()

}