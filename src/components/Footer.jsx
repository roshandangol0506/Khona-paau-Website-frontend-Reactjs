import React from 'react'

const footer = () => {
  return (
    <footer className="bg-slate-700 text-white py-6">
      <div className="container mx-auto px-4">
        {/* Embedded Content Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Facebook Page Embed */}
          <div className="w-full md:w-[340px]">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsiddhi.smiles.dental&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="340"
              height="500"
              className="border-none overflow-hidden w-full"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>

          {/* Google Maps Embed */}
          <div className="w-full md:w-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.949141308665!2d85.30698011113068!3d27.71885652488415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198c9c86b19f%3A0xb670d88b952e31be!2sSiddhi%20Smiles%20Dental%20Clinic!5e0!3m2!1sen!2snp!4v1732466049903!5m2!1sen!2snp"
              width="600"
              height="450"
              className="border-none w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Footer Text Section */}
        <div className="text-center mt-6">
          <p>&copy; 2024 My Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default footer