import { Box } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

const EmblaCarousel = ({ recipes, options }) => {
    const [emblaRef] = useEmblaCarousel(options);
    //   const {
    //     prevBtnDisabled,
    //     nextBtnDisabled,
    //     onPrevButtonClick,
    //     onNextButtonClick,
    //   } = usePrevNextButtons(emblaApi);
    //   const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    return (
        <Box sx={{ position: "relative", width: "100%", maxWidth: 750, mx: "auto" }}>
            <Box
                ref={emblaRef}
                sx={{
                    overflow: "hidden",
                    width: "100%",
                    borderRadius: 3,
                }}
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    {recipes.map((recipe) => (
                        <Box
                            key={recipe.id}
                            sx={{
                                flex: "0 0 75%",
                                minWidth: 0,
                                p: 1,
                                textAlign: "center",
                            }}
                        >
                            <Link
                                to={`/recipe/${recipe.id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <Box
                                    component="img"
                                    src={`http://localhost:3001/uploads/${recipe.image}`}
                                    alt={recipe.title}
                                    sx={{
                                        width: "100%",
                                        height: 350,
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                />
                                <Box sx={{ mt: 1 }}>
                                    <b>{recipe.title}</b>
                                </Box>
                            </Link>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                }}
            >
                <PrevButton onClick={onPrevButtonClick} enabled={!prevBtnDisabled} />
                <NextButton onClick={onNextButtonClick} enabled={!nextBtnDisabled} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                {scrollSnaps.map((_, idx) => (
                    <DotButton
                        key={idx}
                        selected={idx === selectedIndex}
                        onClick={() => onDotButtonClick(idx)}
                    />
                ))}
            </Box> */}
        </Box>
    );
};

export default EmblaCarousel;
