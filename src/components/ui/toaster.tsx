"use client"
import { FaRegCheckCircle } from "react-icons/fa";

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
  offsets: { 
    left: "0px", 
    top: "0px", 
    right: "calc(min(3dvh, 1.75dvw) + min(29.30dvh, 17.13dvw) + 1dvw)", 
    bottom: "min(3dvh, 1.75dvw)" 
  },
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
              //backgroundColor: "rgba(196, 196, 196, 0.8)",
              backgroundColor: "rgba(64, 66, 61, 0.5)",
              color: "white",
              fontWeight: 300, 
              fontStyle: "italic",
              whiteSpace: "nowrap",
              width: "fit-content",
              height: "fit-content",
              display: "flex",
              alignItems: "center",
              padding: "min(1dvh, 0.5dvw)",
            }}>
            {/* Icono check */}
            <FaRegCheckCircle style={{ color: "green", fontSize: "var(--font-size-header)" }} />
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
