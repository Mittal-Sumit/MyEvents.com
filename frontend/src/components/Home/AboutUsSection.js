/* src/components/Home/AboutUsSection.js */
import React from "react";

const AboutUsSection = () => {
  return (
    <div className="small-image-container">
      <img src="/TheLogo.jpg" alt="Logo" className="small-image" />

      <div className="about-us-section">
        <h2>THE MY EVENT STORY</h2>
        <p className="about-us-sub">
          <i>Plan Your Day</i>
        </p>
        <p>
          MyEvent.com began as a small passion project during a casual coffee
          chat between two friends who loved attending events but found it
          difficult to discover the right ones. With a shared vision, they
          dreamed of creating a platform that would bring people closer to the
          events that matter most to them—whether it's a live concert, a charity
          run, or an intimate workshop. In 2021, armed with little more than
          determination and a belief in the power of human connection,
          MyEvent.com was born. What started as a simple event listing site
          quickly grew as users began sharing their love for unique experiences.
          Our community rapidly expanded, and we knew we were onto something
          bigger. Where We Are Now Today, MyEvent.com is more than just a
          platform—it's a destination for discovering moments that spark joy,
          learning, and connection. We've grown into a vibrant ecosystem that
          helps thousands of people find, register for, and engage with events
          in ways they’ve never experienced before. Our platform features
          everything from concerts and festivals to corporate networking events,
          workshops, and beyond. We also offer personalized event
          recommendations based on your interests, making it easier for you to
          find what you're passionate about.{" "}
        </p>
      </div>
    </div>
  );
};

export default AboutUsSection;
