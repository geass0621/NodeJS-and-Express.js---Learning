exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First post', content: 'This is first post!' }]
  })
}

exports.postPosts = (req, res, next) => {
  //create post om db
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      title: title,
      content: content,
      id: new Date().toString()
    }
  })
}