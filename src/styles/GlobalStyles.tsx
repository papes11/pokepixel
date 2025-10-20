import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --bg:rgb(222, 227, 237);
        --main: black;
        --green: #48a058;
        --orange: #d0a000;
        --red: #d05030;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: 10px;
        -webkit-tap-highlight-color: transparent;
        color: var(--main);
    }

    /* PWA Mobile Mode Styles */
    @media (display-mode: standalone) {
        body {
            /* Force mobile layout even on larger screens when installed */
            max-width: 480px;
            margin: 0 auto;
            background-color: #000;
        }
        
        #__next {
            max-width: 480px;
            margin: 0 auto;
            min-height: 100vh;
            background-color: var(--bg);
        }
    }

    button {
        background: none;
        border: none;
        outline: none;
    }
    
    input {
        border: none;
        outline: none;
        background: none;

        // Remove arrows from number input
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    a {
        text-decoration: none;
    }
`;

const GlobalStyles = (): JSX.Element => {
  return <GlobalStyle />;
};

export default GlobalStyles;
