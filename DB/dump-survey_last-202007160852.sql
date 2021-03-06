PGDMP     )    4                x           survey_last    12.2    12.2 %    /           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            0           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            1           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            2           1262    24682    survey_last    DATABASE     �   CREATE DATABASE survey_last WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE survey_last;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            3           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    24690    Answers    TABLE     K  CREATE TABLE public."Answers" (
    id integer NOT NULL,
    survey_id character varying(255),
    consumer_id character varying(255),
    answer text,
    progress character varying(255),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    flags integer,
    accessed character varying(255)
);
    DROP TABLE public."Answers";
       public         heap    postgres    false    3            �            1259    24688    Answers_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Answers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Answers_id_seq";
       public          postgres    false    3    204            4           0    0    Answers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Answers_id_seq" OWNED BY public."Answers".id;
          public          postgres    false    203            �            1259    24753    Reports    TABLE     D  CREATE TABLE public."Reports" (
    id integer NOT NULL,
    survey_id integer,
    params character varying(255),
    generated_links integer,
    accessed_links integer,
    survey_finished integer,
    flags integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Reports";
       public         heap    postgres    false    3            �            1259    24751    Reports_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Reports_id_seq";
       public          postgres    false    3    210            5           0    0    Reports_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;
          public          postgres    false    209            �            1259    24683    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false    3            �            1259    24701    Surveys    TABLE     x  CREATE TABLE public."Surveys" (
    id integer NOT NULL,
    survey_name text,
    survey_desc text,
    form text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "updatedBy" character varying(255),
    flags integer,
    status character varying(255)
);
    DROP TABLE public."Surveys";
       public         heap    postgres    false    3            �            1259    24699    Surveys_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Surveys_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Surveys_id_seq";
       public          postgres    false    3    206            6           0    0    Surveys_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Surveys_id_seq" OWNED BY public."Surveys".id;
          public          postgres    false    205            �            1259    24712    User    TABLE     =  CREATE TABLE public."User" (
    id integer NOT NULL,
    username character varying(255),
    password character varying(255),
    role integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    flags integer NOT NULL,
    "metaData" character varying(255)
);
    DROP TABLE public."User";
       public         heap    postgres    false    3            �            1259    24710    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public          postgres    false    208    3            7           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public          postgres    false    207            �
           2604    24693 
   Answers id    DEFAULT     l   ALTER TABLE ONLY public."Answers" ALTER COLUMN id SET DEFAULT nextval('public."Answers_id_seq"'::regclass);
 ;   ALTER TABLE public."Answers" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    204    204            �
           2604    24756 
   Reports id    DEFAULT     l   ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);
 ;   ALTER TABLE public."Reports" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            �
           2604    24704 
   Surveys id    DEFAULT     l   ALTER TABLE ONLY public."Surveys" ALTER COLUMN id SET DEFAULT nextval('public."Surveys_id_seq"'::regclass);
 ;   ALTER TABLE public."Surveys" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    206    206            �
           2604    24715    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    207    208            &          0    24690    Answers 
   TABLE DATA                 public          postgres    false    204            ,          0    24753    Reports 
   TABLE DATA                 public          postgres    false    210            $          0    24683    SequelizeMeta 
   TABLE DATA                 public          postgres    false    202            (          0    24701    Surveys 
   TABLE DATA                 public          postgres    false    206            *          0    24712    User 
   TABLE DATA                 public          postgres    false    208            8           0    0    Answers_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Answers_id_seq"', 25, true);
          public          postgres    false    203            9           0    0    Reports_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Reports_id_seq"', 3, true);
          public          postgres    false    209            :           0    0    Surveys_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Surveys_id_seq"', 30, true);
          public          postgres    false    205            ;           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 4, true);
          public          postgres    false    207            �
           2606    24698    Answers Answers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT "Answers_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Answers" DROP CONSTRAINT "Answers_pkey";
       public            postgres    false    204            �
           2606    24758    Reports Reports_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Reports" DROP CONSTRAINT "Reports_pkey";
       public            postgres    false    210            �
           2606    24687     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    202            �
           2606    24709    Surveys Surveys_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Surveys"
    ADD CONSTRAINT "Surveys_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Surveys" DROP CONSTRAINT "Surveys_pkey";
       public            postgres    false    206            �
           2606    24720    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    208            &   5  x��Kk�@�����ء���du�i05vp�nJ	�=�"z���@��{G��GCq-]�}��{t��lqs�����v	_��8Z��$-�T^ �0������C��׫�U�3Z�y���u��
�m�m��g��T�6�R�mUB���1��L7���wU�i�I
Վ��6�ր5�Հ�@�@6���k�@�F����Iݪ���<"��n��*n�Q�-���m�ѓ�VSf7%n/m�ك�=��>Ӎ~�M�M�zW�X?/a�60 ��3�3�v��8L��(q 0�����2W0`�J�!�L?Gql��x�
���qX�.b�j�~�,o��EV4E��G����"f͗�Q�%������\�J���nW%�$#�|.�a����s��1J<0~�Y��e�;�J�����준��q�k�p�p�D�>�꟡OǱ'�/q =;ю93�jSW�XAW��P9�H0��!^ ��6Y�F1I_6�1�t���p�-����n8t��4�2�|D�ߤ�>̞�r�I��ܥ\�r]��g)'A�8	�q��q���s�h      ,   �   x���K�Pཿbpc�^��x}L�.�0�
Bh]E�=�ZiQ0�s�|�f�d��4[/����A���T]���|��`�]���f���ZU�++[��kK!����E�0�X�d�{:�Z�/v��/�O	s�������J(&��(��>�;�'I�v �J󀄨E
�B_�$�� \�b�      $   �   x��л�@О� 4h��m�,(HA[��T܇F���Gg���jrr�dy�nJ3�˵��}�֮U�Eb�>p��Z�n�ܦ�9�=� |B��!���!sܞ΍��Kv������`�G^�Ц��:���
�MF ��� sA��ڤZ��"������c�k@H����3�Q���y1�~��3�'���      (      x��\[o9�~ϯ`��6V�T�e[����//|[�	��h4�%�SU�aU)������������>Οp�w��9�J�J��L��� @,����;�!y|vuxy͎Ϯ�Y�t=��*W��Q�=�;y|x�V[�*[��ݽ/w�G!X���WV��}:�*	z���a����������������.Y�y���v��A@���Reg�ON@��J,cOTv*�Q|�Z	�@D���xY	�����'|�iZ�"�4�F�O��9$g����(�*�.	��X���mf[�o�ND��y\ӬY4�I��
�[[��eAf�=�z���?�>��Z��M���H�>}d(+�؜~�ՊV�(�zF��o��xd i6�����zc�z�i�4��h��J�h�:͍,���Ͻė�NjZ���ZY�ý�e��!�j(�a�{�F2��"�5����W��s&�Xh���(�@J5��b�܄ij1 � 2I��70�UH���{������S���O�c}�%��[�\_9��&:b�P�2��m����q�$ �3��ZB�P���j9�����Q����AT�WWQ�W����^�E<�r�z�b釉�H�ɮ�5v=�	4�B�c��@���Zz��A��D�pc��j�Z$l�{(}�s��ċq|�6��� �E���+��C�3�}��J�~q���rH��� ڋ�JG��+?�ؙH'T�4�԰���@����>��1A�:RF>�;�%�Np�A6�sӎ�hDI: ������Iâ�#�C�r@�[�w�	�������Y!
��E�O�����JI'���(����v��r��=j$g0�}�,VXan�j,W't����w�7���n�og���`��9�kcB���p�Ju���$ck��..����.��I �]�A�q���R6ۄ�f�ن�
���(�
 �]W� Q�	���!�<	�Gr��q�$5��R$BN��a���0��0C3@�q�#Te9� @ ?p�S7eO Up�fg��x��5v� HQ<6�����R�9��Uvpցq��Z+}���N�Z0�8h��4o$��4'�~�[^V��KpF�E��9�ܘ��i�Y���p<�{鼄�F�6�X23�>p"�|��lݜL_�%V��}  }�]�0g�7]U�c?�����G�4���\ ��9������(|;������d�<바0Vv9o�ޯߴ�@�E̓0�i����jX|5,~5��&�K���k{w�8��$S����c��}�d���V��A� �4?89�۷`��
�S�ȫ�tZp���<��b��`�z�]�[j�c�����Sy�)w���K>7<:�o��Y���}�^G�M >�O��U���j6�J�+��H����5�:�8�@}q%r'ň�W��;|sZe�<uv�Z�ke��=����r���r05`⭺�l���z-��<�N�K֩/46�,t�c���{��,ck*��&L`��g�� -C���V� D�U`eP(5cD;FyЏ����lcڕ�iZ��.W��{^�HB/	��}�����?Y�C4�Smй��+� �"���/�}�RKT� l��w�6[�F8����%�ë���g��a�^��֞���D	k5��k�5R�p֎�5N�ؐ���g�c���`��(��!5~�L�Y��P����H��ݬ��m�=�=rC� �׽�LSM��@�����r�M[b˖�aKl�7m�[�D��ti�xc;)�#�� @���9���)���9]�� �S�dV��N%��6��r{e�a��0��r�.$�.������
ft��	�@�q�rh(!(e$
��ζ����zd��I���jS� ���zېʏǅ��X�m��{�.��Ź �`���C�����I�6C0������8d(H2�{/|����UAډ���N$&�) &0��r�ky'hcn��6�;EL����Ӹ������D[6&ڲ1і���lL�ec�-m}e��L���y!麪eQ��Ltؓ}p� �GL-Cm3�(�Z���
�V@
����$�����'�ne���aJ��[�"��om~[��v��v�bX�kn��Nc:^)%�e8�7A��q�XA���SZU�½�5+���1�h@��mf�����lP����!�2,�m��>5�%
L�3���j~o4�m��mn�i�+%͢��;��yR!?���h�<b�*���{�b�V�ȲV
�.�Ah�/��y��P��.�od���cS��M9:6�c�:6������,��H��nH't�3��=��}�{8̾hO4X��~GQx~m�Gg��V0)����B��7���d��}� �?��ڷ[Y�#�iIkY�6ri�n������Sv����ٜ��y��4L�I��z"������~g�4lC�sI�R��ΥJm�����. ����-�4�h��x��o��Tr�\/��s֣L<*�Z�$���K���r�:�T����c �8X%�ؽqќ��QB㡿(fϓfGW��w���,H�y&�Z�L�ɥ'�ٳr�Ɀ#���X�n��IN(C<���܀C��fY�3hb_c�)x$�����||���?�Ei@<(-�*;5�����u�%z�D��F�����6�9;�y���*;/+	����q�S��y��ڴ�F�����u*��A�ؘr-�W7Nw��8�����,X|�Y:b���D������	��萉)�q�}��*�������@�\��W�,��l�'[%2^J���x�43���YD��@~y(l-Fa�+
�p�gF�i���ԑ��Y�|�8��c>{��/�ʍŨ����Ũl[Q�QB�Bڛi\~��^��W�-���Cm!��Dݗ�r������_qO� ���V>6֌�4���ħ#�۷��@���79��ܵy�i���Q�i�?�3LBK�v��?�4z6�k��YO��Q�c=�w������߱�;������Ԏ5�iؓ���؇˱��c0�>b�}ȜO��-��i�aro�������=�q�P@��d���r���2���.�"�M��Z +/8(A�Id̳�h�Pʑ��` f<ĭ��7�*��5�"7�RQ��x֭�B�xJ�X�<9����󕅭�a\�ܗ����5�OFt��ꇭ*�?XOt)����ݮ�#�H;+#�4~�`�5w!Q���U�9ۗ�/�iM�?�����UaB�ꋈvՊ��d jd%��32��A�)�r^�@l^�b��IG>TƖ�W*���@B'A��@J��n�`d��W)�6`�4��.�{}���pY���1����j(]��*.�"H?����.�q����O.g7��}Qp�P��jvk$a�*�5��P�"���#Y���P�q�{�]g��}�VO��\g�偨f �R��c(
x4��08�^�i���ξW�U��R��#B�]��U���� �)R�7���8^��/�����#xצ(�P. {����v�]QC�Eܔ<f����G�I<]E��>E_x;����xo)�NW3��G�<{��x��گn��-R��T�&�x�iX��rF��4��4��5�%�¥���i�Xe�;P�{r|tȮ���d�囅~��bK��yj��4N�����~�iUd�<�A�?��w]z� ��+�heǙռg�����h��+�o��'�C���Z0C����#N^��r޲�24�� �TL�'K�{1�|�b5�t��I�(J���b@G��Ӥ�B�1P)?!�c���h� V�,K��HwU ��0c���8��h.������Xv�K���)����z+f��%+2��
W�V�(�6�FL$�-�yC�h���Ă�xf�B�Mz�I�wsR������P�fq��f_��.e��gQrކ|�Kh��������W���0�X2�X:o6�R�b�Q�:�������k�>[A��I�|�:(�9o����8��E�oVپ��,�Y� �  ��	�</�-Xt��x�4�E�
�9Z���I�J�+zՠ�^	��G�ݚ���$�3���S��L��۷z���r���B�G"�Tr��[�_�����(�<�J�L9��+�Ʌ?��h�7�1~�$�����Ka����Tό)�0��J|a�	�:�H�xo���v�﵎K5m:fͩuL~�/\I.״-k�y�1#l�Q-�D��rt1z�\F�:��� D;�[�n98X�z�z���`<���#�X��P�����4ϖ����W�q�f�54��~v�\ds�/|��:��*�_7z�p����Mk�a�nش�6��͆m3�R���Q�m��(o��Zn��t���\ld=���y1ع�?�yWx~a<�	<��Ɲ[_�T��U���Эʑ���ɮ��z�V�����]5�G��x烽k�m�����O�]����s�
Vg>��m���x�Y�U�w�w�i8�������#�E�B[�0��g^Q��fpޓ������c������G�~���H������[&�'���MNZ���A�,��F���A4�ǟ��R�s�����Ud.�n�<29�����q���!�I��_�,����5��׍
w;r�bK7�q��{H-4_D�ͧ��UQ��,��ԯ{����� l�H�=�Ĳ'=h=P"q���9m͗�f�T�j�w6���{��Na�`ycĂ���xRn�S
[m`�&����,�ǐ�z�5�	F�]L����|����7��:RX�#/���^0������8s�qX.����*�'�U�[n���}�-��@����c.�t!:F)f1���sIb�����'��1x��u���MA�����F�|����j���Z�^ !s�PY#r�\���Pt�]�8I�}
��d��@�{�C7`�.�j��6 6aV�n�K��X���Q�J��i4��K�_sLc�����fm^�V�H3+Қ[d�X�EEp�hcn�v��FVۜ[f�Xf3+�5��V��֤m���r�G>���P�K�OF8�㓉����M|�I�Na��;�)��8.�@�Ͳ�Ҋ�����-Aq����~K`\���O�ogy��۠3��^��������Y���]���B��(z x
Uk��bx=�*��~�e��g���5��cE���U+}����GW1n~d
:���ug�5:;���+�FJ�U�vZ˼�}����/L      *   �   x���KO�@����IC��v�-7�2,�F��;�D ������]�҅��{�w�]��S\?
�Q�M	'q_�	�Z^�Bp�o�R�����7�w�x�I.c$ϝ"xJH/Vc=Z8zp[$v̼T��얅��Z�~�ie�Y8��]��!:�����SD���3���\�I�Euu���C�R����ԟ��j�9�ۦ�VCbXu���J}�郠�]7���i{�a��<�eH��I�I44m��r)��A��+.d;      %    /           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            0           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            1           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            2           1262    24682    survey_last    DATABASE     �   CREATE DATABASE survey_last WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE survey_last;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            3           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    24690    Answers    TABLE     K  CREATE TABLE public."Answers" (
    id integer NOT NULL,
    survey_id character varying(255),
    consumer_id character varying(255),
    answer text,
    progress character varying(255),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    flags integer,
    accessed character varying(255)
);
    DROP TABLE public."Answers";
       public         heap    postgres    false    3            �            1259    24688    Answers_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Answers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Answers_id_seq";
       public          postgres    false    3    204            4           0    0    Answers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Answers_id_seq" OWNED BY public."Answers".id;
          public          postgres    false    203            �            1259    24753    Reports    TABLE     D  CREATE TABLE public."Reports" (
    id integer NOT NULL,
    survey_id integer,
    params character varying(255),
    generated_links integer,
    accessed_links integer,
    survey_finished integer,
    flags integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Reports";
       public         heap    postgres    false    3            �            1259    24751    Reports_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Reports_id_seq";
       public          postgres    false    3    210            5           0    0    Reports_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;
          public          postgres    false    209            �            1259    24683    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false    3            �            1259    24701    Surveys    TABLE     x  CREATE TABLE public."Surveys" (
    id integer NOT NULL,
    survey_name text,
    survey_desc text,
    form text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "updatedBy" character varying(255),
    flags integer,
    status character varying(255)
);
    DROP TABLE public."Surveys";
       public         heap    postgres    false    3            �            1259    24699    Surveys_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Surveys_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Surveys_id_seq";
       public          postgres    false    3    206            6           0    0    Surveys_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Surveys_id_seq" OWNED BY public."Surveys".id;
          public          postgres    false    205            �            1259    24712    User    TABLE     =  CREATE TABLE public."User" (
    id integer NOT NULL,
    username character varying(255),
    password character varying(255),
    role integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    flags integer NOT NULL,
    "metaData" character varying(255)
);
    DROP TABLE public."User";
       public         heap    postgres    false    3            �            1259    24710    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public          postgres    false    208    3            7           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public          postgres    false    207            �
           2604    24693 
   Answers id    DEFAULT     l   ALTER TABLE ONLY public."Answers" ALTER COLUMN id SET DEFAULT nextval('public."Answers_id_seq"'::regclass);
 ;   ALTER TABLE public."Answers" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    204    204            �
           2604    24756 
   Reports id    DEFAULT     l   ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);
 ;   ALTER TABLE public."Reports" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            �
           2604    24704 
   Surveys id    DEFAULT     l   ALTER TABLE ONLY public."Surveys" ALTER COLUMN id SET DEFAULT nextval('public."Surveys_id_seq"'::regclass);
 ;   ALTER TABLE public."Surveys" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    206    206            �
           2604    24715    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    207    208            &          0    24690    Answers 
   TABLE DATA                 public          postgres    false    204            ,          0    24753    Reports 
   TABLE DATA                 public          postgres    false    210   E       $          0    24683    SequelizeMeta 
   TABLE DATA                 public          postgres    false    202   �        (          0    24701    Surveys 
   TABLE DATA                 public          postgres    false    206   �        *          0    24712    User 
   TABLE DATA                 public          postgres    false    208   �       8           0    0    Answers_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Answers_id_seq"', 25, true);
          public          postgres    false    203            9           0    0    Reports_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Reports_id_seq"', 3, true);
          public          postgres    false    209            :           0    0    Surveys_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Surveys_id_seq"', 30, true);
          public          postgres    false    205            ;           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 4, true);
          public          postgres    false    207            �
           2606    24698    Answers Answers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT "Answers_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Answers" DROP CONSTRAINT "Answers_pkey";
       public            postgres    false    204            �
           2606    24758    Reports Reports_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Reports" DROP CONSTRAINT "Reports_pkey";
       public            postgres    false    210            �
           2606    24687     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    202            �
           2606    24709    Surveys Surveys_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Surveys"
    ADD CONSTRAINT "Surveys_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Surveys" DROP CONSTRAINT "Surveys_pkey";
       public            postgres    false    206            �
           2606    24720    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    208           