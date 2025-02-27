import React from 'react'

const Home_comp = () => {
    return (
      <div className='flex flex-col gap-4 h-screen items-center justify-center bg-cover bg-center' style={{ backgroundImage: "url('/doctors_background.jpg')" }}>
        <section id="home">
          <h1 className='bg-red-500 text-white p-4 rounded-lg'>Welcome</h1>
          <p className='bg-amber-500 text-black p-2 rounded-lg'>Brighten your day with a brighter smile!</p>
        </section>
      </div>
    );
  };
  
  export default Home_comp;