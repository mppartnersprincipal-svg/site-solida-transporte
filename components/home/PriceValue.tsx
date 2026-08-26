import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function PriceValue() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface-alt p-8 sm:p-10 border-l-4 border-l-brand-action">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-action">
                <AlertTriangle className="size-6" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl text-balance">
                  O frete mais barato pode sair caro
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-body">
                  Quem escolhe uma transportadora apenas pelo menor preço pode acabar pagando caro: carga sem seguro, frota insuficiente e atrasos que se tornam rotina. Em alguns casos, até CNPJs são trocados para deixar problemas para trás.
                </p>
                <p className="mt-4 text-base leading-relaxed text-ink-body">
                  Na Sólida, acreditamos em outro caminho: preço justo, estrutura própria, segurança e compromisso com o que foi combinado.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
