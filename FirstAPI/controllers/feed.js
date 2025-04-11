const { validationResult } = require('express-validator');


exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      _id: '1',
      title: 'First post',
      content: 'This is first post!',
      imageURL: 'images/TL.png',
      creator: {
        name: 'Mike'
      },
      createdAt: new Date()
    }]
  })
}

exports.createPost = (req, res, next) => {
  //create post om db
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: 'Validation failed, entered data is incorrect!',
      errors: errors.array()
    })
  }
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toString(),
      title: title,
      content: content,
      creator: {
        name: 'Mike',
        createdAt: new Date()
      }
    }
  })
}