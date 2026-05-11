import { TextInput } from "@/components/text-input";
import { ConfigTomlDto, TemplateItemDto } from "@/lib/bindings";
import {
  createForm,
  FormStore,
  insert,
  required,
  reset,
  SubmitHandler,
} from "@modular-forms/solid";

type TemplateModalProps = {
  form: FormStore<ConfigTomlDto, undefined>;
};

export function TemplateModal(props: TemplateModalProps) {
  const [templateForm, { Form, Field }] = createForm<TemplateItemDto>();
  let modalRef: HTMLDialogElement | undefined;

  const handleSubmit: SubmitHandler<TemplateItemDto> = (values) => {
    if (templateForm.invalid) return;

    insert(props.form, "templates", {
      value: values,
    });

    reset(templateForm);
    modalRef?.close();
  };

  return (
    <>
      <button class="btn" type="button" onClick={() => modalRef?.showModal()}>
        Add template
      </button>

      <dialog ref={(e) => (modalRef = e)} class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">New template</h2>

          <Form class="py-4" onSubmit={handleSubmit}>
            <fieldset class="fieldset">
              <Field name="key" validate={[required("Required field")]}>
                {(field, props) => (
                  <TextInput
                    {...props}
                    label="Name"
                    name={field.name}
                    value={field.value}
                    error={field.error}
                    required
                  />
                )}
              </Field>
              <Field name="input_path" validate={[required("Required field")]}>
                {(field, props) => (
                  <TextInput
                    {...props}
                    label="Input path"
                    name={field.name}
                    value={field.value}
                    error={field.error}
                    required
                  />
                )}
              </Field>
              <Field name="output_path">
                {(field, props) => (
                  <TextInput
                    {...props}
                    label="Output path"
                    name={field.name}
                    value={field.value ?? ""}
                    error={field.error}
                  />
                )}
              </Field>
              <Field name="pre_hook">
                {(field, props) => (
                  <TextInput
                    {...props}
                    label="Pre hook"
                    name={field.name}
                    value={field.value}
                    error={field.error}
                  />
                )}
              </Field>
              <Field name="post_hook">
                {(field, props) => (
                  <TextInput
                    {...props}
                    label="Post hook"
                    name={field.name}
                    value={field.value}
                    error={field.error}
                  />
                )}
              </Field>
            </fieldset>

            <div class="modal-action">
              <button class="btn btn-primary" type="submit">
                Add template
              </button>

              <button
                class="btn"
                type="button"
                onClick={() => modalRef?.close()}
              >
                Close
              </button>
            </div>
          </Form>
        </div>

        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
