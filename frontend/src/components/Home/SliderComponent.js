/* src/components/Home/SlideComponent.js */
import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ events, sliderSettings }) => {
  return (
    <Slider {...sliderSettings}>
      {events.map((event) => (
        <div key={event.id} className="slider-item">
          <Card className="event-card">
            <CardMedia
              component="img"
              height="140"
              image="CardImg.jpg"
              alt={event.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                {event.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {event.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Location:</strong> {event.location}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  );
};

export default SliderComponent;
