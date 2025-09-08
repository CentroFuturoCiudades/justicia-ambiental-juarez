"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
  offsets: { left: "0px", top: "0px", right: "20dvw", bottom: "2dvh" },
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root 
            //width="fit-content" 
            style={{ 
              //backgroundColor: "rgba(241, 240, 238, 0.8)", 
              backgroundColor: "rgba(175, 104,100, 0.8)",
              fontFamily: "Roboto", 
              fontWeight: 300, 
              fontSize: "3vw", 
              fontStyle: "italic",
              whiteSpace: "nowrap",
              width: "fit-content",
              height: "fit-content",
              padding: "1vw",
            }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description style={{ fontSize: "var(--font-size-body)" }}>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
