import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodDateAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodDate;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodDate, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodDateAccelerator.contentPart.coerce()
				: ZodDateAccelerator.contentPart.typeof(),
			...def.checks.map(
				value => ZodDateAccelerator.contentPart[value.kind]?.(value as any)
			)
		);

		return zac;
	}

	static contentPart = {
		coerce: () => `
            $input = new Date($input);

            if(isNaN($input.getTime())){
                throw new ZodAcceleratorError(\`$path\`, "Input is invalide Date.");
            }
        `,
		typeof: () => ({
			if: /* js */"!($input instanceof Date)",
			message: "Input is invalide Date.",
		}),
		min: ({value}: {value: number}) => ({
			if: /* js */`$input.getTime() < ${value}`,
			message: `Input Date is less than ${value}.`,
		}),
		max: ({value}: {value: number}) => ({
			if: /* js */`$input.getTime() > ${value}`,
			message: `Input Date is more than ${value}.`,
		}),
	};

	static {
		new ZodDateAccelerator();
	}
}
