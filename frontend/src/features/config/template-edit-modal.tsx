import { TextInput } from "@/components/text-input";
import { ConfigTomlDto, TemplateItemDto } from "@/lib/bindings";
import {
  createForm,
  FormStore,
  getValue,
  required,
  setValue,
  SubmitHandler,
} from "@modular-forms/solid";
import { Pencil } from "lucide-solid";

type TemplateModalProps = {
  form: FormStore<ConfigTomlDto, undefined>;
  index: number;
};

export function TemplateEditModal(props: TemplateModalProps) {
  let modalRef: HTMLDialogElement | undefined;
  const [templateForm, { Form, Field }] = createForm<TemplateItemDto>({
    initialValues: {
      key: getValue(props.form, `templates.${props.index}.key`),
      input_path: getValue(props.form, `templates.${props.index}.input_path`),
      output_path: getValue(props.form, `templates.${props.index}.output_path`),
      pre_hook: getValue(props.form, `templates.${props.index}.pre_hook`),
      post_hook: getValue(props.form, `templates.${props.index}.post_hook`),
    },
  });

  const handleSubmit: SubmitHandler<TemplateItemDto> = (values) => {
    if (templateForm.invalid) return;

    setValue(props.form, `templates.${props.index}.key`, values.key);
    setValue(
      props.form,
      `templates.${props.index}.input_path`,
      values.input_path,
    );
    setValue(
      props.form,
      `templates.${props.index}.output_path`,
      values.output_path,
    );
    setValue(props.form, `templates.${props.index}.pre_hook`, values.pre_hook);
    setValue(
      props.form,
      `templates.${props.index}.post_hook`,
      values.post_hook,
    );

    modalRef?.close();
  };

  return (
    <>
      <button
        aria-label="Edit template"
        class="btn btn-square btn-ghost tooltip tooltip-top font-normal"
        type="button"
        onClick={() => modalRef?.showModal()}
        data-tip="Edit template"
      >
        <Pencil class="size-5" />
      </button>

      <dialog ref={(e) => (modalRef = e)} class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Edit template</h2>

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
