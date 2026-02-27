import Link from "next/link";

export default function EnneagramPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <header>
        <div className="text-xs text-surface-500 uppercase tracking-wide">Theory</div>
        <h1 className="mt-2 text-3xl font-semibold">Enneagram</h1>
        <p className="mt-2 text-surface-400">
          Nine personality types defined by their cognitive fixation, emotional passion,
          ego trap, and the Holy Idea that dissolves each pattern.
        </p>
      </header>

      {/* Definitions */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Core Definitions</h2>

        <div className="space-y-3">
          <DefinitionCard
            term="Fixation (The Cognitive Bug)"
            definition="The recurring mental preoccupation of the ego — a filter through which you view the world."
          />
          <DefinitionCard
            term="Passion (The Energy Leak)"
            definition="The distorted emotional motor that drives the fixation. A warped way of feeling that fuels the ego's survival strategy."
          />
          <DefinitionCard
            term="Trap (The Logical Loop)"
            definition="The false solution the ego offers to fix its problems. The more you do it, the more you reinforce the fixation."
          />
          <DefinitionCard
            term="Holy Idea (The Source Code)"
            definition="The enlightened perspective that appears when the fixation is dropped. The objective truth the ego-fixation was trying to simulate."
          />
        </div>
      </section>

      {/* Triads */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Triads</h2>
        <p className="text-surface-400 text-sm">
          Three centers of intelligence. Each triad shares a fundamental way of misinterpreting reality.
        </p>
        <div className="space-y-3">
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Gut Triad (8, 9, 1)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Concerned with existence and territory. The &quot;Doing&quot; center. Core issue: distortion of the Will and struggle with the external environment.
            </p>
          </div>
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Heart Triad (2, 3, 4)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Concerned with identity and image. The &quot;Feeling&quot; center. Core issue: the Ego-Image — how you are perceived and how you perceive yourself.
            </p>
          </div>
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Head Triad (5, 6, 7)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Concerned with security and orientation. The &quot;Thinking&quot; center. Core issue: Fear and the lack of Inner Guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Type Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">The Nine Types</h2>
        <p className="text-surface-400 text-sm">
          Each type&apos;s fixation, passion, trap, and Holy Idea — the full ego mechanism and its antidote.
        </p>
        <div className="space-y-3">
          {TYPES.map((type) => (
            <div key={type.number} className="border border-surface-800 rounded-lg p-5 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-bold text-foreground">{type.number}</span>
                <span className="text-xs text-surface-500 uppercase tracking-wider">{type.triad} Triad</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Fixation</p>
                  <p className="text-surface-300 font-medium">{type.fixationName}</p>
                  <p className="text-surface-400 text-xs mt-0.5">{type.fixation}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Passion</p>
                  <p className="text-surface-300 font-medium">{type.passionName}</p>
                  <p className="text-surface-400 text-xs mt-0.5">{type.passion}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Trap</p>
                  <p className="text-surface-300 font-medium">{type.trapName}</p>
                  <p className="text-surface-400 text-xs mt-0.5">{type.trap}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Holy Idea</p>
                  <p className="text-surface-300 font-medium">{type.holyIdeaName}</p>
                  <p className="text-surface-400 text-xs mt-0.5">{type.holyIdea}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subtypes */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Instinctual Subtypes</h2>
        <p className="text-surface-400 text-sm">
          Each type expresses differently depending on which instinctual drive dominates.
          The subtype is the intersection of your type and your dominant instinct.
        </p>

        <div className="space-y-3">
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Self-Preservation (SP)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Conservation of the Organism. Focuses on food, health, and &quot;nesting.&quot;
            </p>
          </div>
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Social (SO)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Conservation of the Group. Focuses on the &quot;Totem&quot; — your place in the hierarchy or specialized knowledge.
            </p>
          </div>
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Sexual (SX)</h3>
            <p className="mt-1 text-sm text-surface-400">
              Conservation of the Species. Focuses on the &quot;Relation&quot; — the intense, one-on-one merging with a partner or an obsession.
            </p>
          </div>
        </div>
      </section>

      {/* Subtype Details */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">27 Subtypes</h2>
        <p className="text-surface-400 text-sm">
          The full subtype matrix — how each type manifests under each instinctual drive.
        </p>
        <div className="space-y-4">
          {SUBTYPES.map((s) => (
            <div key={s.type} className="border border-surface-800 rounded-lg p-5 space-y-3">
              <p className="font-bold text-foreground">Type {s.type}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-1">SP</p>
                  <p className="text-surface-400 text-xs leading-relaxed">{s.sp}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-1">SO</p>
                  <p className="text-surface-400 text-xs leading-relaxed">{s.so}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-xs uppercase tracking-wide mb-1">SX</p>
                  <p className="text-surface-400 text-xs leading-relaxed">{s.sx}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/theory"
        className="inline-block text-sm text-surface-400 hover:text-foreground transition-colors"
      >
        &larr; Back to Theory
      </Link>
    </div>
  );
}

function DefinitionCard({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="border border-surface-800 rounded-lg p-4">
      <h3 className="font-medium text-sm">{term}</h3>
      <p className="mt-1 text-sm text-surface-400">{definition}</p>
    </div>
  );
}

const TYPES = [
  {
    number: 1,
    triad: "Gut",
    fixationName: "Resentment",
    fixation: "Comes from feeling an obligation to do the right thing while others seem to get away with shirking that responsibility.",
    passionName: "Anger",
    passion: "An energy that arises in service of correcting things that don't match an internalized sense of rightness. Noticed in the form of criticism of things not being done correctly.",
    trapName: "Perfection",
    trap: "Criticizing everything for not being perfect, leading to perpetual criticism.",
    holyIdeaName: "Holy Perfection",
    holyIdea: "The awareness that Reality is a process, moving with direction and purpose. Within this movement each moment is connected by the process with the one goal, and thus is perfect.",
  },
  {
    number: 2,
    triad: "Heart",
    fixationName: "Flattery",
    fixation: "The tendency to pay compliments or special attention to others in order to manipulate oneself into their favor.",
    passionName: "Pride",
    passion: "A self-inflated feeling of importance in the lives of others, coming from a feeling of being needed or indispensable. Often arises out of the belief that I have no needs but am able to satisfy the needs of others.",
    trapName: "Freedom",
    trap: "Dependence on attention, creating a cycle of seeking freedom through flattery and approval, but never achieving true independence.",
    holyIdeaName: "Holy Will, Holy Freedom",
    holyIdea: "The awareness that Reality, moving with direction and according to fixed natural laws, flows with a certain force. The easiest way to deal with this force is to move with it. This is true freedom.",
  },
  {
    number: 3,
    triad: "Heart",
    fixationName: "Vanity",
    fixation: "Places great emphasis on appearance, qualities, abilities, and achievements in order to feel validated.",
    passionName: "Deceit",
    passion: "A packaging of oneself to successfully sell oneself to others. The authentic self aside from the packaging is often lost in the image produced by the presentation.",
    trapName: "Efficiency",
    trap: "Excessive efficiency covering up problems, leading to overwork and deception.",
    holyIdeaName: "Holy Harmony, Holy Law, Holy Hope",
    holyIdea: "The awareness that there are no exceptions to the natural laws which govern the Cosmos, and that these laws are completely objective, operating as an inter-connected unity.",
  },
  {
    number: 4,
    triad: "Heart",
    fixationName: "Melancholy",
    fixation: "Surrounds a lack of emotional fulfillment that longs for what isn't and disparages what is.",
    passionName: "Envy",
    passion: "Notices how others have what I don't because others are more capable than I am. A comparison of the positive in others with the negative in the self.",
    trapName: "Authenticity",
    trap: "Perpetual questioning of reasons and whys, leading to endless inquiry without resolution.",
    holyIdeaName: "Holy Origin",
    holyIdea: "The awareness that all individuals are born as the result of natural, objective laws; that these laws continue to operate within them throughout their lives. From this springs true originality.",
  },
  {
    number: 5,
    triad: "Head",
    fixationName: "Stinginess",
    fixation: "Hoards resources and minimizes needs in an attempt to compensate for a world that seems to take more than it gives.",
    passionName: "Avarice",
    passion: "A greed not for wealth but for time and space to process the world through the intellect. A response to a world that can seem at times intrusive, chaotic, and overwhelming.",
    trapName: "Observer",
    trap: "Hiding and watching life from sidelines without participating.",
    holyIdeaName: "Holy Omniscience, Holy Transparency",
    holyIdea: "The awareness that because every individual is intimately connected with the entire cosmos, there is no separateness or alienation except as a mental hallucination.",
  },
  {
    number: 6,
    triad: "Head",
    fixationName: "Cowardice",
    fixation: "The tendency to succumb to or challenge fears or doubts that arise from an uncertain mind.",
    passionName: "Fear",
    passion: "Often a generalized mistrust of what and how others are thinking. May be allayed by questioning in search of certainty or an action that confronts the perceived fear.",
    trapName: "Security",
    trap: "Seeking safety but continuing to adventure beyond it.",
    holyIdeaName: "Holy Strength, Holy Faith",
    holyIdea: "The awareness that the Cosmos is a self-regulating mechanism existing in a state of balance. Faith is a Holy Idea, not a belief. It is the certitude that each of us has an Essence.",
  },
  {
    number: 7,
    triad: "Head",
    fixationName: "Planning",
    fixation: "Lives in future anticipation of more enjoyable alternatives to boring, uncomfortable, painful, or limiting situations.",
    passionName: "Gluttony",
    passion: "Of the mind — a desire to taste life in all its offerings. The mind imagines an endless stream of appealing possibilities with the challenge of how to experience them all with limited time.",
    trapName: "Idealism",
    trap: "Grand, unrealistic plans that fail repeatedly.",
    holyIdeaName: "Holy Wisdom, Holy Work, Holy Plan",
    holyIdea: "The awareness that Reality exists as a succession of moments, each experienced as the present. Only by working in the present can real work be done and real results achieved.",
  },
  {
    number: 8,
    triad: "Gut",
    fixationName: "Vengeance",
    fixation: "Experiences the world as taking advantage of the vulnerable and a reminder to stand strong and assertive against it.",
    passionName: "Lust",
    passion: "Pursuing intensity or honesty of experience that feels more real and energizing. For others this intensity is often felt as too much, requiring the type 8 to sit on the energy so as not to overwhelm others.",
    trapName: "Justice",
    trap: "Searching for justice through rebellion and revenge, leading to excess and destruction.",
    holyIdeaName: "Holy Truth",
    holyIdea: "The awareness that the cosmos objectively exists now; that the individual experiences the truth of Reality most completely when he views each moment fresh, without preconceptions about what should be happening.",
  },
  {
    number: 9,
    triad: "Gut",
    fixationName: "Indolence",
    fixation: "Arises from the negation or forgetfulness of one's own agenda in order to go along with the agenda of others.",
    passionName: "Sloth",
    passion: "An inertia seeking and maintaining comfort, averse to conflict and disruption. Losing oneself in routines or activities that allow one to just be without having any goals to strive for.",
    trapName: "Seeker",
    trap: "Looking outside for comfort and being, not inside. The indolent type goes looking for the love and meaning he feels deprived of — a continual seeker, but never a finder.",
    holyIdeaName: "Holy Love",
    holyIdea: "The awareness that though the laws which govern reality are objective, they are not cold, because these cosmic laws inevitably lead to the creation of organic life, and Life itself fulfills a cosmic purpose.",
  },
];

const SUBTYPES = [
  {
    type: 1,
    sp: "The true perfectionists. They see themselves as highly flawed and try to improve themselves and make every detail right. The most anxious and worried Ones, but also the most friendly and warm.",
    so: "Focus on doing things perfectly in a larger sense — knowing the right way and modeling it for others. An intellectual type with a teacher mentality.",
    sx: "More reformers than perfectionists. They display more anger and zeal, focusing less on perfecting their own behavior and more on whether others are doing things right.",
  },
  {
    type: 2,
    sp: "Seek approval through being charming and youthful. Less oriented to giving and more burdened by helping. More self-indulgent, playful, and fearful about connecting with others.",
    so: "Seek approval through being powerful, competent, and influential. A leader type who takes charge and plays to a larger audience as a way of proving their value.",
    sx: "Gain approval through being generous and attractive. Emphasize personal appeal and promises of support — a more emotional, passionate Two who seduces specific individuals.",
  },
  {
    type: 3,
    sp: "Work hard to assure material security. Want to appear successful but don't want to brag. Self-sufficient, extremely hard-working, results-oriented, and modest.",
    so: "Work hard to look flawless in the eyes of others. The most aggressive, competitive, well-known Three. They enjoy being onstage and know how to climb the social ladder.",
    sx: "Focus on creating an appealing image and supporting the people around them. A relationship or team mentality — they work hard to support the success of others rather than their own.",
  },
  {
    type: 4,
    sp: "Stoic, strong, and long-suffering. Emotionally sensitive inside but often have a sunny, upbeat exterior. High tolerance for frustration, they tough things out.",
    so: "Focus on their own emotions and the underlying emotional tone of situations. Compare themselves to others and tend to see themselves as less worthy. Wear their feelings on their sleeve.",
    sx: "More assertive and competitive. Not afraid to ask for what they need or complain when they don't get it. Can appear aggressive, and they strive to be the best.",
  },
  {
    type: 5,
    sp: "Focus on maintaining good boundaries. Friendly and warm, they like having a private space to withdraw to. Focus on minimizing needs, finding refuge, and having all they need within their place of safety.",
    so: "Enjoy becoming experts in specific subject areas. They like acquiring knowledge and connecting with others through common intellectual interests and causes.",
    sx: "Have a stronger need to connect with other individuals under the right conditions. More in touch with their emotions inside, with a romantic streak expressed through artistic expression.",
  },
  {
    type: 6,
    sp: "The more actively fearful (phobic or flight) Six. They doubt and question in an effort to find certainty. Seek to be warm and friendly to attract allies as protection.",
    so: "More intellectual types who find safety in following the guidelines of a system or way of thinking. Logical, rational, and concerned with reference points. Can become true believers.",
    sx: "Cope with underlying fear by appearing strong and intimidating. Choose fight over flight — tend to be risk-takers, contrarians, or rebels. Best defense is a good offense.",
  },
  {
    type: 7,
    sp: "Very practical. Good at getting what they want, they readily recognize opportunities and know how to make things happen. A talkative, amiable, hedonistic style.",
    so: "Want to avoid being seen as self-interested, so they focus on sacrificing desires to pursue an ideal of service. Take responsibility for the group and want to be seen as good.",
    sx: "Idealistic dreamers who need to imagine something better than everyday reality. Extremely enthusiastic and optimistic, with a passion for seeing things as they could be.",
  },
  {
    type: 8,
    sp: "Focus on getting what they need to survive in a direct, no-nonsense way. Low tolerance for frustration. They know how to do business and get things done without needing to talk about it.",
    so: "Focus on protecting and mentoring others. While rebellious and assertive, they appear less aggressive as they have a softer side when it comes to taking care of others.",
    sx: "Have a strong rebellious tendency and like to be the center of things. More provocative and passionate than the other Eights, they like to have power over people and situations.",
  },
  {
    type: 9,
    sp: "Focus on finding comfort in familiar routines and physical needs. Whether through eating, sleeping, or reading, they lose themselves in activities that help them feel grounded.",
    so: "Focus on working hard to support the groups they belong to. Congenial, light-hearted, and fun, they expend a lot of effort in doing what it takes to be admitted to and supportive of the group.",
    sx: "Tend to merge with the agenda and attitudes of important others. Sweet, gentle, and less assertive, this relationship-oriented Nine may take on the feelings and opinions of the people they are close to without realizing it.",
  },
];
