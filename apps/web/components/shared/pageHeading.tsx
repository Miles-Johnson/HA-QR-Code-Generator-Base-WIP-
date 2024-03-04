type Props = {
  heading: string;
  subheading?: string;
};

export default function PageHeading({ heading, subheading }: Props) {
  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5 prose">
      <div className="flex items-start space-x-5">
        <div className="pt-1.5">
          <h1 className="heading-1 mb-0">{heading}</h1>
          <p className="heading-2 mt-0">{subheading}</p>
        </div>
      </div>
    </div>
  );
}
