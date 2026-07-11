const stars = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 101}%`,
  top: `${(index * 53 + 7) % 101}%`,
  size: `${index % 7 === 0 ? 4 : index % 3 === 0 ? 3 : 2}px`,
  delay: `${(index % 9) * -0.72}s`,
  duration: `${3 + (index % 6) * 0.9}s`,
}));

export function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="star-field">
        {stars.map((star) => (
          <span
            className="star-dot"
            key={star.id}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
