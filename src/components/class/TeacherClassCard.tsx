import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";

const cards = [
  {
    id: 1,
    title: "Plants",
    description: "Plants are essential for all life.",
    image:
      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    title: "Animals",
    description: "Animals are a part of nature.",
    image:
      "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    image:
      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    image:
      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

function SelectActionCard() {
  const [loading, setLoading] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
        gap: 2.8,
      }}
    >
      {(loading ? Array.from(new Array(4)) : cards).map((card, index) =>
        loading ? (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="80%" />
            </CardContent>
          </Card>
        ) : (
          <Card
            key={(card as (typeof cards)[0]).id}
            sx={{
              maxWidth: 345,
              border:
                selectedCard === (card as (typeof cards)[0]).id
                  ? "2px solid #1976d2"
                  : "none",
              cursor: "pointer",
            }}
            onClick={() => setSelectedCard((card as (typeof cards)[0]).id)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={(card as (typeof cards)[0]).image}
                alt={(card as (typeof cards)[0]).title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {(card as (typeof cards)[0]).title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {(card as (typeof cards)[0]).description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ),
      )}
    </Box>
  );
}

export default SelectActionCard;
