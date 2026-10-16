type ToastAction = { label: string; onClick: () => void };

export interface ToastInput {
  title: string;
  description?: string;
  action?: ToastAction;
  variant?: "default" | "error" | "success";
}

type Listener = (toast: ToastInput & { id: number }) => void;
const listeners = new Set<Listener>();
let nextId = 1;

function emit(input: ToastInput) {
  const item = { ...input, id: nextId++ };
  listeners.forEach((listener) => listener(item));
}

export const toast = {
  message(title: string, options?: Omit<ToastInput, "title" | "variant">) {
    emit({ title, ...options, variant: "default" });
  },
  success(title: string, options?: Omit<ToastInput, "title" | "variant">) {
    emit({ title, ...options, variant: "success" });
  },
  error(title: string, options?: Omit<ToastInput, "title" | "variant">) {
    emit({ title, ...options, variant: "error" });
  },
  loading(title: string) {
    const id = nextId;
    emit({ title, variant: "default" });
    return id;
  },
  dismiss(_id?: number) {
    /* host auto-dismisses */
  },
};

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
