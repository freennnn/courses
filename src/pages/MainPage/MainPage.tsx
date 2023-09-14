import './MainPage.scss';

export default function MainPage() {
  return (
    <>
      <div className='main-feature'>
        <div>
          <p className='main__banner'>
            Write the magic word ten and get a 10% discount on all products
          </p>
          <div className='video-frame'>
            <iframe
              src='https://www.youtube.com/embed/JvNuYOR7b4w?si=keYe2jgSWKqq1k41'
              title='YouTube video player'
              frameBorder='10'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
