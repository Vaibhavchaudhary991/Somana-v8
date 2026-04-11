import axios from 'axios';

async function checkImages() {
  try {
    const res = await axios.get('http://localhost:3000/api/v1/blogs?limit=5');
    const blogs = res.data?.data?.blogs || [];
    
    if (blogs.length === 0) {
      console.log("No blogs found");
      return;
    }

    console.log(`Found ${blogs.length} blogs.`);
    
    for (const blog of blogs) {
      console.log(`\nBlog: ${blog.heading}`);
      console.log(`Image URL: ${blog.featuredImage}`);
      
      if (!blog.featuredImage) continue;

      try {
        const imgRes = await axios.head(blog.featuredImage);
        console.log(`Status: ${imgRes.status} ${imgRes.statusText}`);
        console.log(`Content-Type: ${imgRes.headers['content-type']}`);
      } catch (err) {
        console.error(`Error fetching image: ${err.message}`);
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
        }
      }
    }
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
  }
}

checkImages();
