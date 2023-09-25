import React from 'react'
import AboutCarsoul from './AboutCarsoul'
//import CarouselFadeExample from './AboutCarsoul'

export default function About() {
  return (
    <div className='about'>
    <div className='about-container'>
        <div className=' d-flex flex-column justify-content-center text-center bg-image-container p-4'>
            <p className='para1'>Home<span className='spanned'>/About Us</span></p>
            <h2 className='heading1'>About Us</h2>
            <p className='para1'>Welcome to the app name, where food comes to you as it wont live without you.</p>
        </div>
        <div className='d-flex flex-row justify-content-center content1'>
            <div>
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D&w=1000&q=80" alt="" className='about-image'/>
            </div>
            <div className='content'>
                <h2 className='heading'>Why people choose us</h2>
                <h4 className='heading-2'>It’s simple. We Serve Best Food.</h4>
                <p className='para'>People really happy with us as we peovide the best for them. Best in Food. Best in saving Time. Best in service, Oh god! There is a list of them. We are looking for you to come and visit us where you can feel every bit of food.</p>
                <p className='para'>People really happy with us as we peovide the best for them. Best in Food. Best in saving Time. Best in service, Oh god! There is a list of them. We are looking for you to come and visit us where you can feel every bit of food.</p>
            </div>
        </div>
        <div className='images-container mb-4'>
            <div className='mb-4'>
            <img src="https://images.unsplash.com/photo-1607974347625-36a0bcb6a260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" alt='' className='about-images-row1'/>
            <img src='https://i.pinimg.com/originals/06/a1/f8/06a1f8e1c6d33fc7616c91a152b06629.jpg' alt='' className='about-images-row1'/>
            <img src='https://media.istockphoto.com/id/1467750928/photo/sesame-chicken.webp?b=1&s=170667a&w=0&k=20&c=vQKSw6Bd0No0baFhaSfKU7WNAnwKvvtgEsvZUiAKIgk=' alt='' className='about-images-row1'/>
            <img src="https://www.foodiesfeed.com/wp-content/uploads/2023/06/ice-cream-cone-splash.jpg" alt='' className='about-images-row1'/>
            </div>
             <div className=' mb-4'>
             <img src="https://img.freepik.com/premium-photo/concept-indian-cuisine-baked-chicken-wings-legs-honey-mustard-sauce-serving-dishes-restaurant-black-plate-indian-spices-wooden-table-background-image_127425-18.jpg" alt='' className='about-images-row2'/>
            <img src="https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_640.jpg" alt='' className='about-images-row2'/>
            <img src='https://img.lovepik.com/photo/20211208/small/lovepik-dry-pot-bullfrog-food-picture_501634384.jpg' alt='' className='about-images-row2'/>
            </div>
            <div className='mb-4'>
            <img src="https://artisanhd.com/wp-content/uploads/2018/10/Francesco-Tonelli-Food-Photography-artisanhd.jpg" alt='' className='about-images-row1'/>
            <img src='https://media.istockphoto.com/id/628316640/photo/freshly-flame-grilled-burgers-in-a-row-on-wooden-board.jpg?s=612x612&w=0&k=20&c=53Ai8eRaOGOdxRddyIMmFCuqTIIimU0Bo1LxS17Rh1c=' alt='' className='about-images-row1'/>
            <img src='https://media.istockphoto.com/id/1467750928/photo/sesame-chicken.webp?b=1&s=170667a&w=0&k=20&c=vQKSw6Bd0No0baFhaSfKU7WNAnwKvvtgEsvZUiAKIgk='alt=''  className='about-images-row1'/>
            <img src="https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?cs=srgb&dl=pexels-kristina-paukshtite-1998920.jpg&fm=jpg" alt='' className='about-images-row1'/>
            </div>
        </div>
        <div className=' pt-4 about-carsoul-container  '>
            <AboutCarsoul/>
        </div>
    </div>
    </div>
  )
}
