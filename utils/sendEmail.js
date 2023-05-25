import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const generateEmailTemplate = (mailType, data) => {
  let subTitle = "";
  let body = "";

  if (mailType === "contactForm") {
    body = `<div class="grid place-items-center pt-10">
    <h1 class="text-2xl sm:text-3xl font-semibold">
      Hi, <span class="text-sky-500">Admin</span>
    </h1>
    <h2 class="text-lg mt-3">
      <span class="font-semibold">StoreYEK</span> - New Contact Form
    </h2>
    <div class="mt-3 text-lg">
      <h3>Name: <span class="text-semibold">${data.fullName}</span></h3> 
      <h3>Subject: <span class="text-semibold">${data.subject}</span></h3> 
      <h3>Email: <span class="text-semibold">${data.email}</span></h3> 
      <h3>Message: <span class="text-semibold">${data.message}</span></h3> 
    </div>
  </div>`;
  } else {
    if (mailType === "verifyEmail") {
      subTitle = "Verify your email address";
    } else if (mailType === "resetPassword") {
      subTitle = "Reset your password";
    }
    body = `<div class="grid place-items-center pt-10">
    <h1 class="text-2xl sm:text-3xl font-semibold">
      Hi, <span class="text-sky-500">${data.fullName}</span>
    </h1>
    <h2 class="text-lg">
      <span class="font-semibold">StoreYEK</span> - ${subTitle}
    </h2>
    <span class="mt-3 font-semibold text-sm">
      <a class="text-sky-500" href="${data.url}">Click</a>
      to reset your password.
    </span>
  </div>`;
  }

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Aktivasyon</title>
      <style>
        *,
        ::after,
        ::before {
          box-sizing: border-box;
          border-width: 0;
          border-style: solid;
          border-color: #e5e7eb;
        }
        ::after,
        ::before {
          --tw-content: "";
        }
        html {
          line-height: 1.5;
          -webkit-text-size-adjust: 100%;
          -moz-tab-size: 4;
          tab-size: 4;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
          font-feature-settings: normal;
          font-variation-settings: normal;
        }
        body {
          margin: 0;
          line-height: inherit;
        }
        hr {
          height: 0;
          color: inherit;
          border-top-width: 1px;
        }
        abbr:where([title]) {
          -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-size: inherit;
          font-weight: inherit;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        b,
        strong {
          font-weight: bolder;
        }
        code,
        kbd,
        pre,
        samp {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 1em;
        }
        small {
          font-size: 80%;
        }
        sub,
        sup {
          font-size: 75%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
        sub {
          bottom: -0.25em;
        }
        sup {
          top: -0.5em;
        }
        table {
          text-indent: 0;
          border-color: inherit;
          border-collapse: collapse;
        }
        button,
        input,
        optgroup,
        select,
        textarea {
          font-family: inherit;
          font-size: 100%;
          font-weight: inherit;
          line-height: inherit;
          color: inherit;
          margin: 0;
          padding: 0;
        }
        button,
        select {
          text-transform: none;
        }
        [type="button"],
        [type="reset"],
        [type="submit"],
        button {
          -webkit-appearance: button;
          background-color: transparent;
          background-image: none;
        }
        :-moz-focusring {
          outline: auto;
        }
        :-moz-ui-invalid {
          box-shadow: none;
        }
        progress {
          vertical-align: baseline;
        }
        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
          height: auto;
        }
        [type="search"] {
          -webkit-appearance: textfield;
          outline-offset: -2px;
        }
        ::-webkit-search-decoration {
          -webkit-appearance: none;
        }
        ::-webkit-file-upload-button {
          -webkit-appearance: button;
          font: inherit;
        }
        summary {
          display: list-item;
        }
        blockquote,
        dd,
        dl,
        figure,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        hr,
        p,
        pre {
          margin: 0;
        }
        fieldset {
          margin: 0;
          padding: 0;
        }
        legend {
          padding: 0;
        }
        menu,
        ol,
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        textarea {
          resize: vertical;
        }
        input::placeholder,
        textarea::placeholder {
          opacity: 1;
          color: #9ca3af;
        }
        [role="button"],
        button {
          cursor: pointer;
        }
        :disabled {
          cursor: default;
        }
        audio,
        canvas,
        embed,
        iframe,
        img,
        object,
        svg,
        video {
          display: block;
          vertical-align: middle;
        }
        img,
        video {
          max-width: 100%;
          height: auto;
        }
        [hidden] {
          display: none;
        }
        *,
        ::before,
        ::after {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-rotate: 0;
          --tw-skew-x: 0;
          --tw-skew-y: 0;
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
          --tw-scroll-snap-strictness: proximity;
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgb(59 130 246 / 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-saturate: ;
          --tw-sepia: ;
          --tw-drop-shadow: ;
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
        ::-webkit-backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-rotate: 0;
          --tw-skew-x: 0;
          --tw-skew-y: 0;
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
          --tw-scroll-snap-strictness: proximity;
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgb(59 130 246 / 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-saturate: ;
          --tw-sepia: ;
          --tw-drop-shadow: ;
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
        ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-rotate: 0;
          --tw-skew-x: 0;
          --tw-skew-y: 0;
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
          --tw-scroll-snap-strictness: proximity;
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgb(59 130 246 / 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-saturate: ;
          --tw-sepia: ;
          --tw-drop-shadow: ;
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
        .mt-3 {
          margin-top: 0.75rem;
        }
        .grid {
          display: grid;
        }
        .place-items-center {
          place-items: center;
        }
        .bg-zinc-800 {
          --tw-bg-opacity: 1;
          background-color: rgb(39 39 42 / var(--tw-bg-opacity));
        }
        .pt-10 {
          padding-top: 2.5rem;
        }
        .text-2xl {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .font-semibold {
          font-weight: 600;
        }
        .text-zinc-100 {
          --tw-text-opacity: 1;
          color: rgb(244 244 245);
        }
        .text-sky-500 {
          --tw-text-opacity: 1;
          color: rgb(14 165 233);
        }
        @media (min-width: 640px) {
          .sm\:text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
        }
      </style>
    </head>
    <body class="bg-zinc-800 text-zinc-100">
      ${body}
    </body>
  </html>
  `;
};

export default async ({ email, subject, mailType, data }) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: generateEmailTemplate(mailType, data),
    };
    await transporter.sendMail(mailOptions);
    return { error: null };
  } catch (err) {
    console.log("Email couldn't be sent");
    return { error: err.message };
  }
};
