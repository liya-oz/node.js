const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const dirPath = path.join(__dirname, 'blogs');

fs.stat(dirPath, (err, stats) => {
  if (err) {
    fs.mkdir(dirPath, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
      } else {
        console.log('Directory created');
      }
    });
  } else if (!stats.isDirectory()) {
    console.log('Path exists but is not a directory');
  } else {
    console.log('Directory already exists');
  }
});

function checkTitleAndContent(req, res, next) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required!');
  }

  req.filePath = path.join(dirPath, `${title}.txt`);
  req.title = title;
  req.content = content;
  next();
}

app.post('/blogs', checkTitleAndContent, (req, res) => {
  const { filePath, content } = req;

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return res.status(400).send('Post with this title already exists!');
    }

    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        return res.status(500).send('There was a problem creating the post.');
      }
      res.status(201).send('Post created!');
    });
  });
});

app.put('/blogs/:title', checkTitleAndContent, (req, res) => {
  const { filePath, content } = req;

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Post not found!');
    }

    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Problem updating post.');
      }
      res.send('Post updated!');
    });
  });
});

app.delete('/blogs/:title', (req, res) => {
  const filePath = path.join(dirPath, `${req.params.title}.txt`);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Post not found!');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error deleting post.');
      }
      res.send('Post deleted!');
    });
  });
});

app.get('/blogs/:title', (req, res) => {
  const filePath = path.join(dirPath, `${req.params.title}.txt`);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Post not found!');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading post.');
      }
      res.send(data);
    });
  });
});

app.get('/blogs', (req, res) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error retrieving posts.');
    }

    let blogPosts = [];
    files.forEach((file) => {
      blogPosts.push({ title: file.replace('.txt', '') });
    });

    res.json(blogPosts);
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
