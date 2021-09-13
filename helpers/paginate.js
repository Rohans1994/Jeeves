module.exports = function paginatedResult(model){
  return async (req, res, next)=>{
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const start = (page-1) * limit
    const end = page*limit;
    const result = {}
    
    if(end > model.length){
      result.next={
        page: page+1,
        limit: limit
      }
    }

    if(start > 0){
      result.previous = {
        page: page-1,
        limit: limit
      }
    }

    try {
      result.result = await model.find().limit(limit).skip(start).exec();
      res.paginatedResult = result;
      next()
    } catch (e) {
      res.status(500).json({message: e.message})
      
    }
  }
}