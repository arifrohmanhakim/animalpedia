/* ... keep existing code up to the VideoPlayerModal call ... */
    {showVideo && (
      <VideoPlayerModal
        videoEmbedUrl={animal.videoEmbedUrl}
        videoUrl={animal.videoUrl}
        animalName={animal.name}
        onClose={() => setShowVideo(false)}
      />
    )}
    /* ... rest of code ... */