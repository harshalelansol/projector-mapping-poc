"use client";

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function LandingPage() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#0a0a0a",
        color: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #00ff88, #00aaff)",
          filter: "blur(100px)",
          top: "20%",
          left: "20%",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #ff0055, #ffaa00)",
          filter: "blur(120px)",
          bottom: "10%",
          right: "10%",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Image
              src="/assets/images/favicon_icon.png"
              alt="Projector Mapping Tool Logo"
              width={150}
              height={150}
              priority
            />
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "3rem", md: "5rem" },
              background: "linear-gradient(90deg, #ffffff, #888888)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              letterSpacing: "-2px",
            }}
          >
            Projector Mapping POC
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "grey.400",
              fontWeight: 300,
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Welcome to the future of visual projection. Design, calibrate, and
            transform surfaces with our advanced mapping tool.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/projector" passHref>
            <Button
              variant="contained"
              size="large"
              endIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: "50px",
                padding: "16px 48px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                boxShadow: "0 10px 30px rgba(33, 203, 243, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                  boxShadow: "0 20px 40px rgba(33, 203, 243, 0.5)",
                },
                textTransform: "none",
              }}
            >
              Start Projector Mapping
            </Button>
          </Link>
        </motion.div>
      </Container>
    </Box>
  );
}
