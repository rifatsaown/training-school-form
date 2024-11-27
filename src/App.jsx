import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const App = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // Watch for languages and patient types
  const watchLanguages = watch([
    'English',
    'Bengali',
    'Spanish',
    'Chinese',
    'Hindi',
    'Other',
  ]);
  const watchPatientTypes = watch([
    'Elderly(65+)',
    'Adults(18-64)',
    'Children(0-17)',
    'Individuals with disabilities',
  ]);

  // Add this function to format phone numbers
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const onSubmit = (data) => {
    // Check if at least one language is selected
    const hasLanguage = Object.entries(data).some(
      ([key, value]) =>
        ['English', 'Bengali', 'Spanish', 'Chinese', 'Hindi', 'Other'].includes(
          key
        ) && value
    );

    // Check if at least one patient type is selected
    const hasPatientType = Object.entries(data).some(
      ([key, value]) =>
        [
          'Elderly(65+)',
          'Adults(18-64)',
          'Children(0-17)',
          'Individuals with disabilities',
        ].includes(key) && value
    );

    // Return early if validation fails
    if (!hasLanguage || !hasPatientType) {
      return;
    }

    // Create languages array
    const languages = Object.entries(data)
      .filter(
        ([key, value]) =>
          [
            'English',
            'Bengali',
            'Spanish',
            'Chinese',
            'Hindi',
            'Other',
          ].includes(key) && value
      )
      .map(([key]) => key);
    // Add "other" language if specified
    if (data.Other && data.otherLanguage) {
      languages.push(data.otherLanguage);
    }
    // Create patient types array
    const patientTypes = Object.entries(data)
      .filter(
        ([key, value]) =>
          [
            'Elderly(65+)',
            'Adults(18-64)',
            'Children(0-17)',
            'Individuals with disabilities',
          ].includes(key) && value
      )
      .map(([key]) => key);

    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dob: data.dob,
      healthcare: data.healthcare,
      experience: data.experience,
      languages,
      patientTypes,
    };

    fetch(import.meta.env.VITE_API_URL + '/teaching-school/form-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Form submitted successfully');
          reset();
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong');
      });
  };

  // Check if at least one language is selected
  const hasLanguageSelected = watchLanguages.some(Boolean);
  // Check if at least one patient type is selected
  const hasPatientTypeSelected = watchPatientTypes.some(Boolean);

  return (
    <div className="text-[#121C52]">
      <section className="bg-[#e0f2fe] pb-10">
        <div className={`lg:mx-[13.5em]`}>
          <div className="space-y-5 py-10 w-3/4 mx-auto">
            <h2 className="lg:text-4xl text-3xl font-extrabold text-center">
              Training School Form Filling
            </h2>
            <p className="text-lg text-center">
              This is not a formal application but a way for us to know
              you&apos;re interested. Once you&apos;ve submitted the form, one
              of our coordinators will reach out to you as soon as possible to
              provide further details and guide you through the next steps.
            </p>
          </div>

          <form
            className="p-16 bg-white py-10 rounded-3xl "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-red-500 pb-5">
              Required fields are marked with *
            </div>
            <div className="lg:grid grid-cols-2 gap-5">
              <div className="font-black text-lg space-y-5">
                <div>
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    {...register('firstName', { required: true })}
                    type="text"
                    required
                    id="firstName"
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full "
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    {...register('lastName', { required: true })}
                    type="text"
                    required
                    id="lastName"
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full "
                  />
                </div>
                <div>
                  <label htmlFor="email">Email*</label>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    required
                    id="email"
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full "
                  />
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth*</label>
                  <input
                    {...register('dob', { required: true })}
                    type="date"
                    required
                    id="dob"
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full "
                  />
                </div>
                <div className="font-bold text-lg space-y-2">
                  <p className="font-black">Language(s) Spoken*</p>
                  {!hasLanguageSelected && (
                    <span className="text-red-500 text-sm">
                      Please select at least one language
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      {...register('English')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="english"
                    />
                    <label htmlFor="english">English</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Bengali')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="bengali"
                    />
                    <label htmlFor="bengali">Bengali</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Spanish')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="spanish"
                    />
                    <label htmlFor="spanish">Spanish</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Chinese')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="chinese"
                    />
                    <label htmlFor="chinese">
                      Chinese (Mandarin/Cantonese)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Hindi')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="hindi"
                    />
                    <label htmlFor="hindi">Hindi</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      {...register('Other')}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      id="other"
                    />
                    <label htmlFor="other">Other</label>
                    <input
                      {...register('otherLanguage')}
                      type="text"
                      className="input border-[#D6D3D1] bg-[#F5F5F4] w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="font-black text-lg space-y-5">
                <div>
                  <label htmlFor="phone-number">Phone Number*</label>
                  <input
                    {...register('phone', {
                      required: true,
                      onChange: (e) => {
                        e.target.value = formatPhoneNumber(e.target.value);
                      },
                    })}
                    type="text"
                    required
                    maxLength="14"
                    id="phone-number"
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full"
                  />
                </div>
                <div>
                  <label htmlFor="address">County*</label>
                  <input
                    {...register('address', { required: true })}
                    type="text"
                    id="address"
                    required
                    className="input border-[#D6D3D1] bg-[#F5F5F4] w-full "
                  />
                </div>
                <div className="space-y-2 font-bold">
                  <p className="mb-2 font-black">
                    Have you worked in the healthcare sector within the last 3
                    years?*
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('healthcare', {
                        required: 'Please select an option',
                      })}
                      type="radio"
                      value="Yes"
                      id="yes"
                      name="healthcare"
                      className="radio radio-primary"
                    />
                    <label htmlFor="yes">Yes</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('healthcare')}
                      type="radio"
                      value="No"
                      id="no"
                      name="healthcare"
                      className="radio radio-primary"
                    />
                    <label htmlFor="no">No</label>
                  </div>
                  {errors.healthcare && (
                    <span className="text-red-500 text-sm">
                      {errors.healthcare.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2 font-bold">
                  <p className="mb-2 font-black">
                    Duration of your experience*
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('experience', {
                        required: 'Please select an option',
                      })}
                      type="radio"
                      value="More than 3 months"
                      id="more"
                      name="experience"
                      className="radio radio-primary"
                    />
                    <label htmlFor="more">More than 3 months</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('experience')}
                      type="radio"
                      value="Less than 3 months"
                      id="less"
                      name="experience"
                      className="radio radio-primary"
                    />
                    <label htmlFor="less">Less than 3 months</label>
                  </div>
                  {errors.experience && (
                    <span className="text-red-500 text-sm">
                      {errors.experience.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2 font-bold">
                  <p className="mb-2 font-black">
                    What type of patients did you care for?*
                  </p>
                  {!hasPatientTypeSelected && (
                    <span className="text-red-500 text-sm">
                      Please select at least one patient type
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Elderly(65+)')}
                      type="checkbox"
                      id="elderly"
                      className="checkbox checkbox-primary"
                    />
                    <label htmlFor="elderly">Elderly (65+)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Adults(18-64)')}
                      type="checkbox"
                      id="adults"
                      className="checkbox checkbox-primary"
                    />
                    <label htmlFor="adults">Adults (18-64)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Children(0-17)')}
                      type="checkbox"
                      id="children"
                      className="checkbox checkbox-primary"
                    />
                    <label htmlFor="children">Children (0-17)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register('Individuals with disabilities')}
                      type="checkbox"
                      id="individuals"
                      className="checkbox checkbox-primary"
                    />
                    <label htmlFor="individuals">
                      Individuals with disabilities
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-10">
              Submit
            </button>
            <div className="flex items-center justify-center mt-10">
              <p className="text-lg text-center">
                Thank you for your interest. This preliminary form helps us
                understand your intent to join our program. Upon submission, our
                program coordinator will contact you directly to provide
                comprehensive information and guide you through the formal
                application process.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default App;
