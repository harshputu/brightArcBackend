
//Get all Blogs

GET: http://localhost:3000/api/blogs

// Get Single blog by slug

GET: http://localhost:3000/api/blogs/:slug

// Create a post

POST: http://localhost:3000/api/blogs

//Update a blog by slug

PUT:  http://localhost:3000/api/blogs/:slug

//Delete a blog by slug

DELETE : http://localhost:3000/api/blogs/:slug


// COMMENT

//Add a comment

POST: http://localhost:3000/api/blogs/:slug/comments

// Approve or Reject a Comment

PATCH : http://localhost:3000/api/blogs/:slug/comments/:commentId/status

LIKE AND UNLIKE FEATURE

POST: http://localhost:3000/api/blogs/:slug/like

POST: http://localhost:3000/api/blogs/:slug/unlike
