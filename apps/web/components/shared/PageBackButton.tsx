import Link from "next/link";

type Props = {
  href: string;
  text: string;
};

export default function PageBackButton({ href, text }: Props) {
  return (
    <div>
      <Link href={href} className="btn btn-sm rounded-full my-4">
        <svg
          className=""
          style={{
            marginTop: "3px",
          }}
          width="16px"
          height="16px"
          viewBox="0 0 16 16"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="Post-Editor-(empty)"
              transform="translate(-213.000000, -33.000000)"
            >
              <g id="Group-13">
                <g id="Group-6" transform="translate(209.000000, 28.000000)">
                  <g
                    id="ic-arrow-forward-36px"
                    transform="translate(12.000000, 13.000000) rotate(-180.000000) translate(-12.000000, -13.000000) translate(0.000000, 1.000000)"
                  >
                    <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                    <polygon
                      id="Path"
                      fill="#000000"
                      points="12 4 10.5866667 5.41333333 16.1733333 11 4 11 4 13 16.1733333 13 10.5866667 18.5866667 12 20 20 12"
                    ></polygon>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        {text}
      </Link>
    </div>
  );
}
