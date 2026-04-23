import './Gallery.css';

function Gallery() {
  const images = [
    '962i.png', '962ii.png', '962iii.png', '855i.png', '855ii.png',
    '754i.png', '754ii.png', '754iii.png', '754iv.png', '754v.png',
    '198i.png', '198ii.png', '198iii.png', '198iv.png',
    'dg096ei.png', 'dg096ii.png', 'dg096eiii.png', 'dg096eiv.png', 'dg096ev.png',
    '880i.png', '880ii.png', '880iii.png', '880iv.png'
  ];

  return (
    <div className="container">
      <h1>Gallery</h1>
      <p>Some of our latest work:</p>
      <div className="grid">
        {images.map((img, index) => (
          <img key={index} src={`/images/gallery/${img}`} alt={`Job ${index + 1}`} />
        ))}
        <video controls>
          <source src="/images/gallery/paint.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Gallery;