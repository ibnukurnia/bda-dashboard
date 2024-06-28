import React from 'react';
import { Box, Grid } from '@mui/material';
import Image from 'next/image';
import brimoLogo from '/public/assets/dashboard/logo/brimo.png';
import brizziLogo from '/public/assets/dashboard/logo/brizzi.png';
import ceriaLogo from '/public/assets/dashboard/logo/ceria.png';
import blankLogo from '/public/assets/dashboard/logo/blank.png';

const ImageGrid: React.FC = () => {
    const images = [
        { src: brimoLogo, alt: 'Brimo Logo' },
        { src: brizziLogo, alt: 'Brizzi Logo' },
        { src: ceriaLogo, alt: 'Ceria Logo' },
        { src: blankLogo, alt: 'Blank Logo' },
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 1 }}>
            <Grid container spacing={1}>
                {images.map((image, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            layout="responsive"
                            width={500}
                            height={500}
                            objectFit="contain"
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageGrid;
