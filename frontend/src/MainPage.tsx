import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/store/RootStoreProvider";

function MainPage() {
  const rootStore = useRootStore();

  return <></>;
}

export default observer(MainPage);
