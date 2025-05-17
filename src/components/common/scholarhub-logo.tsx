const ScholarHubLogo = ({
  fontSize = "text-2xl",
  className,
}: {
  fontSize?: string,
  className?: string,
}) => {
  return (
    <p className={`font-garamond italic text-center text-primary font-medium ${fontSize} ${className}`}>
      ScholarHub
    </p>
  )
}

export default ScholarHubLogo