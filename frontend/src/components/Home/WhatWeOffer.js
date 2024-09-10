/* src/components/Home/WhatWeOffer.js */
import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import "./WhatWeOffer.css";

const WhatWeOffer = () => {
  return (
    <div className="what-we-offer-section">
      <h1 className="what-we-offer-heading">What We Offer?</h1>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                Customized Event Planning
              </Typography>
              <Typography variant="body2" component="p">
                We help you plan events that suit your needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                Seamless Registration
              </Typography>
              <Typography variant="body2" component="p">
                Register for events with ease and efficiency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                Real-Time Event Updates
              </Typography>
              <Typography variant="body2" component="p">
                Stay updated with real-time notifications.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                VIP Access to Exclusive Events
              </Typography>
              <Typography variant="body2" component="p">
                Get VIP access to the most exclusive events.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                24/7 Customer Support
              </Typography>
              <Typography variant="body2" component="p">
                We offer around-the-clock customer support.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="offer-card">
            <CardContent>
              <Typography variant="h6" component="h2">
                Diverse Event Options
              </Typography>
              <Typography variant="body2" component="p">
                From concerts to corporate events, we cover it all.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default WhatWeOffer;
