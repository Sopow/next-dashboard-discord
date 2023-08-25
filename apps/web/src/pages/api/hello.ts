// generate a hello world api endpoint next js

// Path: apps/web/src/pages/api/hello.ts

export default (req, res) => {
    res.status(200).json({ name: 'John Doe' })
}