import "./App.css";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";
import "buffer";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Alert from "../alert/alert";
import ItemList from "../item-list/item-list";
import MessageList from "../message-list/message-list";
import SettingsList from "../settings-list/settings-list";
import CreatePostModal from "../create-post-modal/create-post-modal";
import CreateMessageModal from "../create-message-modal/create-message-modal";
import UserModal from "../user-modal/user-modal";
import FaqModal from "../faq-modal/faq-modal";
import NavigationBar from "../navigation-bar/navigation-bar";
import CategoryList from "../category-list/category-list";
import {
  fetchConfig,
  fetchUserByStakeAddr,
  fetchUser,
  fetchPosts,
  fetchSocials,
  fetchMessages,
  fetchCategories,
  fetchSocialCategories,
  fetchSubcategories,
  fetchLocations,
  fetchSublocations,
} from "../../rest-api";
import {
  getStakeAddress,
  getStakeAddressSignature,
  sendMetadata,
} from "../../cardano";
import SocialList from "../social-list/social-list";
import CreateSocialModal from "../create-social-modal/create-social-modal";
import * as Sentry from "@sentry/react";
import NinjaConfig from "../../ninjaConfig";
import ReactGA from "react-ga4";
import Fetcher from "../fetcher/Fetcher";
import {
  hexStringToBytes,
  generateKeyPairFromPassword,
  encryptMessage,
  decryptMessage,
} from "../../encryption";

if (window.location.hostname != "localhost") {
  Sentry.init({
    dsn: "https://1abf1b7466555f2ff66548d908727fcf@o4506706468143104.ingest.sentry.io/4506706470502401",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      "localhost",
      "localhost:8080",
      /^https:\/\/decon\.app\//,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

function App() {
  enum Display {
    Social,
    Market,
    Messages,
    Settings,
  }

  React.useEffect(() => {
    fetchConfig().then((result) => new NinjaConfig().setCfg(result));

    if (window.location.hostname != "localhost") {
      ReactGA.initialize("G-R3SCF8L4NF");
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname + window.location.search,
        title: "App",
      });
    }
  }, []);

  const [display, setDisplay] = useState(Display.Social);

  const [socialsQuery, setSocialsQuery] = useState(null);
  const [itemsQuery, setItemsQuery] = useState(null);
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [wallet, setWallet] = useState(null);
  const [api, setApi] = useState(null);
  const [username, setUsername] = useState<string | null>(null);
  const [to, setTo] = useState(null);
  const [parentSocial, setParentSocial] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState<string | null>(null);
  const [alertLink, setAlertLink] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<string | null>(null);

  const {
    data: config,
    error: configError,
    isError: configIsError,
    isLoading: configIsLoading,
  } = useQuery("config", () => fetchConfig());
  const {
    data: user,
    error: userError,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useQuery(["user", userQuery], () => fetchUser(userQuery!!));
  const {
    data: posts,
    error: postsError,
    isError: postsIsError,
    isLoading: postsIsLoading,
  } = useQuery<any, any>(["posts", itemsQuery], () => fetchPosts(itemsQuery));
  const {
    data: socials,
    error: socialsError,
    isError: socialsIsError,
    isLoading: socialsIsLoading,
  } = useQuery<any, any>(["socials", socialsQuery], () =>
    fetchSocials(socialsQuery)
  );
  const {
    data: messages,
    error: messagesError,
    isError: messagesIsError,
    isLoading: messagesIsLoading,
  } = useQuery(["messages", username], () => fetchMessages(username!!));
  const {
    data: categories,
    error: categoriesError,
    isError: categoriesIsError,
    isLoading: categoriesIsLoading,
  } = useQuery<any, any>("categories", fetchCategories);
  const {
    data: socialcategories,
    error: socialcategoriesError,
    isError: socialcategoriesIsError,
    isLoading: socialcategoriesIsLoading,
  } = useQuery<any, any>("socialcategories", fetchSocialCategories);
  const {
    data: subcategories,
    error: subcategoriesError,
    isError: subcategoriesIsError,
    isLoading: subcategoriesIsLoading,
  } = useQuery("subcategories", fetchSubcategories);
  const {
    data: locations,
    error: locationsError,
    isError: locationsIsError,
    isLoading: locationsIsLoading,
  } = useQuery("locations", fetchLocations);
  const {
    data: sublocations,
    error: sublocationsError,
    isError: sublocationsIsError,
    isLoading: sublocationsIsLoading,
  } = useQuery("sublocations", fetchSublocations);

  const queryClient = useQueryClient();

  const refreshAllQueries = () => {
    queryClient.invalidateQueries();
  };

  const updateWallet = async (_wallet) => {
    console.log("START updateWallet");
    setWallet(_wallet);
    if (_wallet) {
      let _api = await _wallet.enable();
      console.log("_api");
      console.log(_api);
      setApi(_api);
      console.log("api");
      console.log(api);

      // get username from stakeAddress of wallet
      console.log("calling getStakeAddr from updateWallet");
      let stakeAddress = await getStakeAddress(_api);
      let user = await fetchUserByStakeAddr(stakeAddress);

      setUsername(user?.user ?? null);
    } else {
      console.log("SETTING API TO NULL!!");
      console.log("SETTING API TO NULL!!");
      console.log("SETTING API TO NULL!!");
      setApi(null);
    }
    ReactGA.event({
      category: "User",
      action: "Connected wallet",
    });
  };

  const selectCategory = async (_category) => {
    setDisplay(Display.Market);
    setItemsQuery(_category);
    ReactGA.event({
      category: "User",
      action: "Clicked a Category",
    });
  };

  const selectSocialCategory = async (_category) => {
    setDisplay(Display.Social);
    setSocialsQuery(_category);
    ReactGA.event({
      category: "User",
      action: "Clicked a SocialCategory",
    });
  };

  const selectUserQuery = async (username) => {
    setUserQuery(username);
  };

  const selectSettings = async () => {
    setDisplay(Display.Settings);
    ReactGA.event({
      category: "User",
      action: "Clicked Settings",
    });
  };

  const selectSocial = async () => {
    setDisplay(Display.Social);
    ReactGA.event({
      category: "User",
      action: "Clicked Social",
    });
  };

  const selectMarket = async () => {
    setDisplay(Display.Market);
    ReactGA.event({
      category: "User",
      action: "Clicked Market",
    });
  };

  const selectMessages = async () => {
    console.log("SELECT MESSAGES");
    setDisplay(Display.Messages);
    ReactGA.event({
      category: "User",
      action: "Clicked Messages",
    });
  };

  const selectMessageTarget = async (target) => {
    console.log("Setting to:" + target);
    setTo(target);
  };

  const selectSocialTarget = async (target) => {
    console.log("Setting to:" + target);
    setParentSocial(target);
  };

  const closeAlert = async () => {
    setShowAlert(false);
    setAlertText(null);
    setAlertType(null);
    setAlertLink(null);
  };

  const getEncryptionKey = async (): Promise<KeyPair | null> => {
    console.log("getEncryptionKey called!");
    const userSignedSecret = await getStakeAddressSignature(api);

    if (userSignedSecret) {
      const keyPair = generateKeyPairFromPassword(
        hexStringToBytes(userSignedSecret)
      );
      return keyPair;
    }
    return null;
  };

  async function getDecryptedMessage(
    privateKey: string,
    encryptedMessage: Message
  ): Promise<string> {
    if (!privateKey) return "Encrypted";

    const encryptedSymmetricKey =
      username == encryptedMessage.from
        ? encryptedMessage.srcKey
        : encryptedMessage.dstKey;

    const decryptedMessage = await decryptMessage(
      privateKey,
      encryptedSymmetricKey,
      encryptedMessage.iv,
      encryptedMessage.message
    );

    return decryptedMessage;
  }

  const createPost = async (
    _username,
    userinfo,
    title,
    price,
    description,
    category,
    subcategory,
    location,
    sublocation
  ) => {
    console.log(_username);
    console.log(userinfo);

    ReactGA.event({
      category: "User",
      action: "Started creating a Post",
    });

    const postObj: Post = {
      from: username!!,
      title: title,
      price: price,
      description: description,
      category: category,
      subcategory: subcategory,
      location: location,
      sublocation: sublocation,
      guid: uuidv4(),
    };
    (postObj as any).type = "post";

    createTransaction(api, postObj, _username, userinfo);
  };

  const createSocial = async (
    _username,
    userinfo,
    parent,
    title,
    content,
    socialcategory
  ) => {
    console.log(_username);
    console.log(userinfo);

    ReactGA.event({
      category: "User",
      action: "Started creating a Social",
    });

    const socialObj: Social = {
      from: username!!,
      parent: parent,
      title: title,
      content: content,
      category: socialcategory,
      guid: uuidv4(),
    };
    (socialObj as any).type = "social";

    createTransaction(api, socialObj, _username, userinfo);
  };

  const createMessage = async (_username, userinfo, _to, message) => {
    console.log(_username);
    console.log(userinfo);
    console.log(_to);
    console.log(message);

    ReactGA.event({
      category: "User",
      action: "Started creating a Message",
    });

    let signature = await getStakeAddressSignature(api);
    let keyPair = await generateKeyPairFromPassword(
      hexStringToBytes(signature)
    );
    const toUser = await fetchUser(_to);
    const encryptedMessage = await encryptMessage(
      keyPair.publicKey,
      toUser!!.publicKey,
      message
    );

    const messageObj: Message = {
      from: username!!,
      to: _to,
      srcKey: encryptedMessage.srcKey,
      dstKey: encryptedMessage.dstKey,
      iv: encryptedMessage.iv,
      message: encryptedMessage.message,
      guid: uuidv4(),
    };
    (messageObj as any).type = "msg";
    createTransaction(api, messageObj, _username, userinfo);
  };

  const createTransaction = async (
    api,
    metadataJsonObj: Message | Social | Post,
    _username,
    userinfo
  ) => {
    try {
      let transactionHash = await sendMetadata(
        api,
        metadataJsonObj,
        _username,
        userinfo
      );
      setAlertText(
        "Transaction created! Follow your transaction here after a couple of seconds:"
      );
      setAlertType("alert-success");
      setAlertLink(`${config.FOLLOW_TRANSACTION_URL}${transactionHash}`);
      setShowAlert(true);

      ReactGA.event({
        category: "User",
        action: "Created a Transaction",
      });
    } catch (err) {
      console.error(
        "Error! Check your account balance, refresh the page and try again? Error: " +
          err
      );
      console.log(err);
      setAlertText("Error: " + err);
      setAlertType("alert-danger");
      setShowAlert(true);

      ReactGA.event({
        category: "User",
        action: "Failed creating a Transaction",
      });

      throw err;
    }
  };

  const renderContent = function (display: Display) {
    switch (display) {
      case Display.Market:
        return (
          <ItemList
            items={posts}
            wallet={wallet}
            selectUser={selectUserQuery}
            selectMessageTarget={selectMessageTarget}
          />
        );
      case Display.Messages:
        return (
          <MessageList
            messages={messages}
            wallet={wallet}
            selectUser={selectUserQuery}
            selectMessageTarget={selectMessageTarget}
            getEncryptionKey={getEncryptionKey}
            getDecryptedMessage={getDecryptedMessage}
          />
        );
      case Display.Settings:
        return (
          <SettingsList
            closeSettings={() => setDisplay(Display.Social)}
            refreshQueries={refreshAllQueries}
          />
        );
      default:
        return (
          <SocialList
            socials={socials}
            wallet={wallet}
            selectUser={selectUserQuery}
            selectSocialTarget={selectSocialTarget}
          />
        );
    }
  };

  if (!new NinjaConfig().getCfg()) {
    return <span>Loading...</span>;
  }

  if (configIsLoading || postsIsLoading || categoriesIsLoading) {
    return <span>Loading...</span>;
  }
  if (postsIsError) {
    return <span>Error: {postsError.message}</span>;
  }
  if (categoriesIsError) {
    return <span>Error: {categoriesError.message}</span>;
  }

  return (
    <div>
      <Fetcher socials={socials} refreshQueries={refreshAllQueries} />
      <Header />
      <div className="App">
        <NavigationBar
          showMarket={display == Display.Market}
          selectSocial={selectSocial}
          selectMarket={selectMarket}
          selectSettings={selectSettings}
          selectMessages={selectMessages}
          wallet={wallet}
          setWallet={updateWallet}
          messages={messages}
          username={username}
          categories={display == Display.Market ? categories : socialcategories}
          selectCategory={
            display == Display.Market ? selectCategory : selectSocialCategory
          }
        />
        <div className="d-flex app-contents">
          <div className="app-desktop">
            {display == Display.Market ? (
              <CategoryList
                categories={categories}
                selectCategory={selectCategory}
              />
            ) : (
              <CategoryList
                categories={socialcategories}
                selectCategory={selectSocialCategory}
              />
            )}
          </div>
          {renderContent(display)}
        </div>
        {showAlert ? (
          <Alert
            text={alertText}
            link={alertLink}
            type={alertType}
            closeAlert={closeAlert}
          />
        ) : (
          ""
        )}
        <CreatePostModal
          username={username}
          createPost={createPost}
          categories={categories}
          subcategories={subcategories}
          locations={locations}
          sublocations={sublocations}
        />
        <CreateSocialModal
          username={username}
          parent={parentSocial}
          createSocial={createSocial}
          socialcategories={socialcategories}
        />
        <CreateMessageModal
          username={username}
          to={to}
          createMessage={createMessage}
        />
        <UserModal
          user={user}
          wallet={wallet}
          selectMessageTarget={selectMessageTarget}
        />
        <FaqModal />
      </div>
      <Footer />
    </div>
  );
}

export default App;
