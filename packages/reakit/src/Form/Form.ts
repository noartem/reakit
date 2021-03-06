import * as React from "react";
import { createComponent } from "reakit-system/createComponent";
import { createHook } from "reakit-system/createHook";
import { useLiveRef } from "reakit-utils/useLiveRef";
import { BoxOptions, BoxHTMLProps, useBox } from "../Box/Box";
import { unstable_FormStateReturn } from "./FormState";
import { FORM_KEYS } from "./__keys";

export type unstable_FormOptions = BoxOptions &
  Pick<unstable_FormStateReturn<any>, "submit">;

export type unstable_FormHTMLProps = BoxHTMLProps &
  React.FormHTMLAttributes<any>;

export type unstable_FormProps = unstable_FormOptions & unstable_FormHTMLProps;

export const unstable_useForm = createHook<
  unstable_FormOptions,
  unstable_FormHTMLProps
>({
  name: "Form",
  compose: useBox,
  keys: FORM_KEYS,

  useProps(options, { onSubmit: htmlOnSubmit, ...htmlProps }) {
    const onSubmitRef = useLiveRef(htmlOnSubmit);

    const onSubmit = React.useCallback(
      (event: React.FormEvent) => {
        onSubmitRef.current?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        options.submit?.();
      },
      [options.submit]
    );

    return {
      role: "form",
      noValidate: true,
      onSubmit,
      ...htmlProps,
    };
  },
});

export const unstable_Form = createComponent({
  as: "form",
  useHook: unstable_useForm,
});
